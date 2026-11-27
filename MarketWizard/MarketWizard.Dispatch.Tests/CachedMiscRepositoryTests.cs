using System.Text.Json;
using MarketWizard.Contracts.Interfaces;
using MarketWizard.Contracts.Models;
using MarketWizard.Infrastructure.Repositories;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace MarketWizard.Dispatch.Tests;

public class CachedMiscRepositoryTests
{
    [Fact]
    public async Task Save_invalidates_all_cached_argument_variants()
    {
        var inner = new FakeRepository();
        var cache = new FakeCache();
        var repository = Create(inner, cache);
        await repository.SaveAsync(Snapshot());
        await FetchVariants(repository);
        inner.Date = FakeRepository.Timestamp.AddDays(1);
        await repository.SaveAsync(Snapshot());
        await FetchVariants(repository);
        Assert.Equal(20, inner.Calls);
        Assert.Equal(inner.Date, (await repository.FetchTopNews()).Date);
        Assert.Equal(inner.Date, (await repository.FetchIndicesPerformance()).Date);
        Assert.Equal(20, inner.Calls);
    }

    [Fact]
    public async Task Failed_save_does_not_replace_cached_values()
    {
        var inner = new FakeRepository();
        var cache = new FakeCache();
        var repository = Create(inner, cache);
        await repository.SaveAsync(Snapshot());
        await FetchVariants(repository);
        inner.Date = FakeRepository.Timestamp.AddDays(1);
        inner.FailSave = true;
        await Assert.ThrowsAsync<InvalidOperationException>(() => repository.SaveAsync(Snapshot()));
        await FetchVariants(repository);
        Assert.Equal(10, inner.Calls);
        Assert.Equal(FakeRepository.Timestamp, (await repository.FetchTopNews()).Date);
        Assert.Equal(FakeRepository.Timestamp, (await repository.FetchIndicesPerformance()).Date);
    }

    [Fact]
    public async Task Failed_version_update_disables_old_cached_values()
    {
        var inner = new FakeRepository();
        var cache = new FakeCache();
        var repository = Create(inner, cache);
        await repository.SaveAsync(Snapshot());
        await FetchVariants(repository);
        inner.Date = FakeRepository.Timestamp.AddDays(1);
        cache.FailSet = true;
        await repository.SaveAsync(Snapshot());
        Assert.Equal(2, inner.Saves);
        Assert.Equal(inner.Date, (await repository.FetchTopNews()).Date);
        Assert.Equal(inner.Date, (await repository.FetchIndicesPerformance()).Date);
    }

    [Fact]
    public async Task Every_method_returns_cached_json_on_second_call_with_five_minute_expiration()
    {
        var inner = new FakeRepository();
        var cache = new FakeCache();
        var repository = Create(inner, cache);
        var countries = new[] { "US", "GB" };
        await repository.SaveAsync(Snapshot());

        await AssertCached(() => repository.FetchTopNews(countries));
        await AssertCached(() => repository.FetchIndicesPerformance());
        await AssertCached(() => repository.FetchSectorPerformance(countries));
        await AssertCached(() => repository.FetchMapPerformance());
        await AssertCached(() => repository.FetchTopIndustries(countries, "week"));
        await AssertCached(() => repository.FetchWorstIndustries(countries, "week"));
        await AssertCached(() => repository.FetchGainers(countries, "week"));
        await AssertCached(() => repository.FetchLosers(countries, "week"));

        Assert.Equal(8, inner.Calls);
        Assert.Equal(9, cache.Values.Count);
        Assert.Equal(9, cache.Options.Count);
        Assert.All(cache.Options.Skip(1), options => Assert.Equal(TimeSpan.FromMinutes(5), options.AbsoluteExpirationRelativeToNow));
    }

    [Fact]
    public async Task Keys_distinguish_methods_and_complete_arguments()
    {
        var inner = new FakeRepository();
        var cache = new FakeCache();
        var repository = Create(inner, cache);
        await repository.SaveAsync(Snapshot());

        await repository.FetchTopNews(null);
        await repository.FetchTopNews(Array.Empty<string>());
        await repository.FetchTopNews(new[] { "US", "GB" });
        await repository.FetchTopNews(new[] { "GB", "US" });
        await repository.FetchTopNews(new[] { "US,GB" });
        await repository.FetchGainers(new[] { "US" }, null);
        await repository.FetchGainers(new[] { "US" }, "");
        await repository.FetchGainers(new[] { "US" }, "week");
        await repository.FetchGainers(new[] { "GB" }, "week");
        await repository.FetchLosers(new[] { "US" }, "week");
        await repository.FetchTopIndustries(new[] { "US" }, "week");
        await repository.FetchWorstIndustries(new[] { "US" }, "week");

        Assert.Equal(12, inner.Calls);
        Assert.Equal(13, cache.Values.Count);

        await repository.FetchTopNews(new[] { "US", "GB" });
        await repository.FetchGainers(new[] { "US" }, "week");
        Assert.Equal(12, inner.Calls);
    }

    [Theory]
    [InlineData(true, false)]
    [InlineData(false, true)]
    [InlineData(true, true)]
    public async Task Cache_failures_fall_back_to_inner_repository(bool failGet, bool failSet)
    {
        var inner = new FakeRepository();
        var cache = new FakeCache { FailGet = failGet, FailSet = failSet };
        var repository = Create(inner, cache);
        cache.FailSet = false;
        await repository.SaveAsync(Snapshot());
        cache.FailSet = failSet;

        var result = await repository.FetchTopNews(new[] { "US" });

        Assert.Equal(FakeRepository.Timestamp, result.Date);
        Assert.Equal(1, inner.Calls);
    }

    [Fact]
    public async Task Inner_errors_propagate_and_are_not_cached()
    {
        var inner = new FakeRepository { Fail = true };
        var cache = new FakeCache();
        var repository = Create(inner, cache);
        await repository.SaveAsync(Snapshot());

        await Assert.ThrowsAsync<InvalidOperationException>(() => repository.FetchTopNews());
        Assert.Single(cache.Values);
        Assert.Single(cache.Options);
        inner.Fail = false;
        await repository.FetchTopNews();
        await repository.FetchTopNews();
        Assert.Equal(2, inner.Calls);
        Assert.Equal(2, cache.Values.Count);
    }

    private static CachedCronJobRepository Create(FakeRepository inner, FakeCache cache) =>
        new(inner, cache, NullLogger<CachedCronJobRepository>.Instance);

    private static MarketSnapshot Snapshot() => new(new([], FakeRepository.Timestamp), new([], FakeRepository.Timestamp),
        new([], FakeRepository.Timestamp), [], [], [], [], []);

    private static async Task FetchVariants(ICronJobRepository repository)
    {
        await repository.FetchTopNews();
        await repository.FetchTopNews(["US"]);
        await repository.FetchIndicesPerformance();
        await repository.FetchSectorPerformance(["US"]);
        await repository.FetchMapPerformance();
        await repository.FetchTopIndustries(["US"], "1");
        await repository.FetchWorstIndustries(["US"], "1");
        await repository.FetchGainers(["US"], "1");
        await repository.FetchGainers(["GB"], "2");
        await repository.FetchLosers(["US"], "1");
    }

    private static async Task AssertCached<T>(Func<Task<T>> fetch)
    {
        var first = await fetch();
        var second = await fetch();
        Assert.Equal(JsonSerializer.Serialize(first), JsonSerializer.Serialize(second));
    }

    private sealed class FakeRepository : ICronJobRepository
    {
        public static readonly DateTime Timestamp = new(2025, 1, 2, 3, 4, 5, DateTimeKind.Utc);
        public int Calls { get; private set; }
        public DateTime Date { get; set; } = Timestamp;
        public bool Fail { get; set; }
        public bool FailSave { get; set; }
        public int Saves { get; private set; }
        public Task SaveAsync(MarketSnapshot snapshot, CancellationToken cancellationToken = default)
        {
            if (FailSave) throw new InvalidOperationException("save failure");
            Saves++;
            return Task.CompletedTask;
        }

        private Task<T> Result<T>(T value)
        {
            Calls++;
            if (Fail) throw new InvalidOperationException("inner failure");
            return Task.FromResult(value);
        }

        public Task<TopNewsDataDto> FetchTopNews(IReadOnlyList<string>? countries = null) => Result(new TopNewsDataDto([], Date));
        public Task<IndicePerformanceDataDto> FetchIndicesPerformance() => Result(new IndicePerformanceDataDto([], Date));
        public Task<SectorPerformanceDataDto> FetchSectorPerformance(IReadOnlyList<string> countries) => Result(new SectorPerformanceDataDto([], Timestamp));
        public Task<IReadOnlyList<TreeMapDto>> FetchMapPerformance() => Result<IReadOnlyList<TreeMapDto>>([new TreeMapDto(default, [])]);
        public Task<TopIndustriesDataDto> FetchTopIndustries(IReadOnlyList<string> countries, string period) => Result(new TopIndustriesDataDto([], Timestamp));
        public Task<WorstIndustriesDataDto> FetchWorstIndustries(IReadOnlyList<string> countries, string period) => Result(new WorstIndustriesDataDto([], Timestamp));
        public Task<GainersDataDto> FetchGainers(IReadOnlyList<string> countries, string? period = null) => Result(new GainersDataDto([], Timestamp));
        public Task<LosersDataDto> FetchLosers(IReadOnlyList<string> countries, string? period = null) => Result(new LosersDataDto([], Timestamp));
    }


    private sealed class FakeCache : IDistributedCache
    {
        public Dictionary<string, byte[]> Values { get; } = new();
        public List<DistributedCacheEntryOptions> Options { get; } = new();
        public bool FailGet { get; set; }
        public bool FailSet { get; set; }

        public byte[]? Get(string key)
        {
            if (FailGet) throw new InvalidOperationException("cache get failure");
            return Values.GetValueOrDefault(key);
        }

        public Task<byte[]?> GetAsync(string key, CancellationToken token = default) => Task.FromResult(Get(key));

        public void Set(string key, byte[] value, DistributedCacheEntryOptions options)
        {
            if (FailSet) throw new InvalidOperationException("cache set failure");
            Values[key] = value;
            Options.Add(options);
        }

        public Task SetAsync(string key, byte[] value, DistributedCacheEntryOptions options, CancellationToken token = default)
        {
            Set(key, value, options);
            return Task.CompletedTask;
        }

        public void Refresh(string key) { }
        public Task RefreshAsync(string key, CancellationToken token = default) => Task.CompletedTask;
        public void Remove(string key) => Values.Remove(key);
        public Task RemoveAsync(string key, CancellationToken token = default)
        {
            Remove(key);
            return Task.CompletedTask;
        }
    }
}
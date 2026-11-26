using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using MarketWizard.Contracts.Interfaces;
using MarketWizard.Contracts.Models;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace MarketWizard.Infrastructure.Repositories;

public sealed class CachedMiscRepository(
    IMiscRepository inner,
    IDistributedCache cache,
    ILogger<CachedMiscRepository> logger) : IMiscRepository, IMarketSyncRepository
{
    private static readonly DistributedCacheEntryOptions CacheOptions = new()
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
    };

    public Task<TopNewsDataDto> FetchTopNews(IReadOnlyList<string>? countries = null) =>
        GetOrFetch(nameof(FetchTopNews), [countries], () => inner.FetchTopNews(countries));

    public Task<IndicePerformanceDataDto> FetchIndicesPerformance() =>
        GetOrFetch(nameof(FetchIndicesPerformance), [], inner.FetchIndicesPerformance);

    public Task<TopNewsDataDto> FetchFreshTopNews() => inner.FetchTopNews();

    public Task<IndicePerformanceDataDto> FetchFreshIndicesPerformance() => inner.FetchIndicesPerformance();

    public async Task UpdateCache(TopNewsDataDto topNews, IndicePerformanceDataDto indicesPerformance, CancellationToken cancellationToken)
    {
        await WriteCache(nameof(FetchTopNews), [null], topNews, cancellationToken);
        await WriteCache(nameof(FetchIndicesPerformance), [], indicesPerformance, cancellationToken);
    }

    public Task<SectorPerformanceDataDto> FetchSectorPerformance(IReadOnlyList<string> countries) =>
        GetOrFetch(nameof(FetchSectorPerformance), [countries], () => inner.FetchSectorPerformance(countries));

    public Task<IReadOnlyList<TreeMapDto>> FetchMapPerformance() =>
        GetOrFetch(nameof(FetchMapPerformance), [], inner.FetchMapPerformance);

    public Task<TopIndustriesDataDto> FetchTopIndustries(IReadOnlyList<string> countries, string period) =>
        GetOrFetch(nameof(FetchTopIndustries), [countries, period], () => inner.FetchTopIndustries(countries, period));

    public Task<WorstIndustriesDataDto> FetchWorstIndustries(IReadOnlyList<string> countries, string period) =>
        GetOrFetch(nameof(FetchWorstIndustries), [countries, period], () => inner.FetchWorstIndustries(countries, period));

    public Task<GainersDataDto> FetchGainers(IReadOnlyList<string> countries, string? period = null) =>
        GetOrFetch(nameof(FetchGainers), [countries, period], () => inner.FetchGainers(countries, period));

    public Task<LosersDataDto> FetchLosers(IReadOnlyList<string> countries, string? period = null) =>
        GetOrFetch(nameof(FetchLosers), [countries, period], () => inner.FetchLosers(countries, period));

    private async Task<T> GetOrFetch<T>(string method, object?[] arguments, Func<Task<T>> fetch)
    {
        var key = CacheKey(method, arguments);

        try
        {
            var cached = await cache.GetStringAsync(key);
            if (cached is not null && JsonSerializer.Deserialize<T>(cached) is { } value)
                return value;
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "Failed to read cache for {Method}", method);
        }

        var result = await fetch();
        await WriteCache(method, arguments, result, CancellationToken.None);
        return result;
    }

    private static string CacheKey(string method, object?[] arguments)
    {
        var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(arguments))));
        return $"misc:v1:{method}:{hash}";
    }

    private async Task WriteCache<T>(string method, object?[] arguments, T result, CancellationToken cancellationToken)
    {
        var key = CacheKey(method, arguments);
        try
        {
            await cache.SetStringAsync(key, JsonSerializer.Serialize(result), CacheOptions, cancellationToken);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "Failed to write cache for {Method}", method);
            try
            {
                await cache.RemoveAsync(key, cancellationToken);
            }
            catch (Exception removeException) when (removeException is not OperationCanceledException)
            {
                logger.LogWarning(removeException, "Failed to invalidate cache for {Method}", method);
            }
        }
    }
}
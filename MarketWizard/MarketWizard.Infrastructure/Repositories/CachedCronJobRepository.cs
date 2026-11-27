using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using MarketWizard.Contracts.Interfaces;
using MarketWizard.Contracts.Models;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;

namespace MarketWizard.Infrastructure.Repositories;

public sealed class CachedCronJobRepository(
    ICronJobRepository inner,
    IDistributedCache cache,
    ILogger<CachedCronJobRepository> logger) : ICronJobRepository
{
    private const string VersionKey = "cronjob:v1:version";
    private static readonly DistributedCacheEntryOptions CacheOptions = new()
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(5)
    };

    public Task<TopNewsDataDto> FetchTopNews(IReadOnlyList<string>? countries = null) =>
        GetOrFetch(nameof(FetchTopNews), [countries], () => inner.FetchTopNews(countries));

    public Task<IndicePerformanceDataDto> FetchIndicesPerformance() =>
        GetOrFetch(nameof(FetchIndicesPerformance), [], inner.FetchIndicesPerformance);

    public async Task SaveAsync(MarketSnapshot snapshot, CancellationToken cancellationToken = default)
    {
        await inner.SaveAsync(snapshot, cancellationToken);
        try
        {
            await cache.SetStringAsync(VersionKey, Guid.NewGuid().ToString(), CancellationToken.None);
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "Failed to update cache version");
            try
            {
                await cache.RemoveAsync(VersionKey, CancellationToken.None);
            }
            catch (Exception removeException) when (removeException is not OperationCanceledException)
            {
                logger.LogWarning(removeException, "Failed to invalidate cache version");
            }
        }
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
        string? key = null;
        try
        {
            var version = await cache.GetStringAsync(VersionKey);
            if (version is not null)
            {
                key = CacheKey(version, method, arguments);
                var cached = await cache.GetStringAsync(key);
                if (cached is not null && JsonSerializer.Deserialize<T>(cached) is { } value)
                    return value;
            }
        }
        catch (Exception ex) when (ex is not OperationCanceledException)
        {
            logger.LogWarning(ex, "Failed to read cache for {Method}", method);
        }

        var result = await fetch();
        if (key is not null)
            await WriteCache(key, method, result, CancellationToken.None);
        return result;
    }

    private static string CacheKey(string version, string method, object?[] arguments)
    {
        var hash = Convert.ToHexString(SHA256.HashData(Encoding.UTF8.GetBytes(JsonSerializer.Serialize(arguments))));
        return $"cronjob:v1:{version}:{method}:{hash}";
    }

    private async Task WriteCache<T>(string key, string method, T result, CancellationToken cancellationToken)
    {
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
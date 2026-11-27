using System.Text.Json;
using MarketWizard.Contracts.Interfaces;
using MarketWizard.Contracts.Models;
using MarketWizard.Infrastructure.Persistence;
using MarketWizard.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarketWizard.Infrastructure.Repositories;

public class CronJobRepository(MarketWizardContext context) : ICronJobRepository
{
    public async Task SaveAsync(MarketSnapshot snapshot, CancellationToken cancellationToken = default)
    {
        await context.CronJobs.AddAsync(new CronJob
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow,
            TopNews = JsonSerializer.Serialize(snapshot.TopNews),
            IndexPerformance = JsonSerializer.Serialize(snapshot.IndicesPerformance),
            SectorPerformance = JsonSerializer.Serialize(snapshot.SectorPerformance),
            MapPerformance = JsonSerializer.Serialize(snapshot.MapPerformance),
            TopIndustries = JsonSerializer.Serialize(snapshot.TopIndustries),
            WorstIndustries = JsonSerializer.Serialize(snapshot.WorstIndustries),
            Gainers = JsonSerializer.Serialize(snapshot.Gainers),
            Losers = JsonSerializer.Serialize(snapshot.Losers),
        }, cancellationToken);
        
        await context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task<TopNewsDataDto> FetchTopNews(IReadOnlyList<string>? countries = null)
    {
        var data = Read<TopNewsDataDto>((await Latest())?.TopNews) ?? new TopNewsDataDto([]);
        return data with { Items = Filter(data.Items, countries, item => item.Country) };
    }

    public async Task<IndicePerformanceDataDto> FetchIndicesPerformance() =>
        Read<IndicePerformanceDataDto>((await Latest())?.IndexPerformance) ?? new IndicePerformanceDataDto([]);

    public async Task<SectorPerformanceDataDto> FetchSectorPerformance(IReadOnlyList<string> countries)
    {
        var data = Read<SectorPerformanceDataDto>((await Latest())?.SectorPerformance) ?? new SectorPerformanceDataDto([]);
        return data with { Items = Filter(data.Items, countries, item => item.Country) };
    }

    public async Task<IReadOnlyList<TreeMapDto>> FetchMapPerformance() =>
        Read<List<TreeMapDto>>((await Latest())?.MapPerformance) ?? [];

    public async Task<TopIndustriesDataDto> FetchTopIndustries(IReadOnlyList<string> countries, string period)
    {
        var data = Period<TopIndustriesDataDto>((await Latest())?.TopIndustries, period) ?? new TopIndustriesDataDto([]);
        return data with { Items = Filter(data.Items, countries, item => item.Country) };
    }

    public async Task<WorstIndustriesDataDto> FetchWorstIndustries(IReadOnlyList<string> countries, string period)
    {
        var data = Period<WorstIndustriesDataDto>((await Latest())?.WorstIndustries, period) ?? new WorstIndustriesDataDto([]);
        return data with { Items = Filter(data.Items, countries, item => item.Country) };
    }

    public async Task<GainersDataDto> FetchGainers(IReadOnlyList<string> countries, string? period = null)
    {
        var data = Period<GainersDataDto>((await Latest())?.Gainers, period) ?? new GainersDataDto([]);
        return data with { Items = Filter(data.Items, countries, item => item.Country) };
    }

    public async Task<LosersDataDto> FetchLosers(IReadOnlyList<string> countries, string? period = null)
    {
        var data = Period<LosersDataDto>((await Latest())?.Losers, period) ?? new LosersDataDto([]);
        return data with { Items = Filter(data.Items, countries, item => item.Country) };
    }

    private Task<CronJob?> Latest() => context.CronJobs.AsNoTracking().OrderByDescending(x => x.Date).FirstOrDefaultAsync();

    private static T? Read<T>(string? json) => json is null ? default : JsonSerializer.Deserialize<T>(json);

    private static T? Period<T>(string? json, string? period) where T : class
    {
        var values = Read<Dictionary<string, T>>(json);
        var key = string.IsNullOrWhiteSpace(period) ? "1" : period.Trim();
        return values is not null && values.TryGetValue(key, out var value) ? value : null;
    }

    private static List<T> Filter<T>(IEnumerable<T> items, IReadOnlyList<string>? countries, Func<T, string?> country)
    {
        if (countries is null || countries.Count == 0)
            return items.ToList();

        var selected = new HashSet<string>(countries, StringComparer.OrdinalIgnoreCase);
        return items.Where(item => country(item) is { } value && selected.Contains(value)).ToList();
    }
}
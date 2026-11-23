using MarketWizard.Contracts.Interfaces;
using MarketWizard.Contracts.Models;

namespace MarketWizard.Infrastructure.Repositories;

public interface IMapPerformanceBuilder
{
    Task<List<TreeMapDto>> BuildMapPerformanceAsync();
}

public static class RandomExtensions
{
    public static double NextDouble(double min, double max) =>
        min + (Random.Shared.NextDouble() * (max - min));
}

public class MapPerformanceBuilder : IMapPerformanceBuilder
{
    public async Task<List<TreeMapDto>> BuildMapPerformanceAsync()
    {
        List<TreeMapDto> list =
        [
            .. from SectorType sector in Enum.GetValues<SectorType>()
            select new TreeMapDto(sector,
            [
                new TreeMapCompanyDto("X", RandomExtensions.NextDouble(-0.05, 0.05)),
                new TreeMapCompanyDto("Y", 0.1),
                new TreeMapCompanyDto("Z", 0.1)
            ])
        ];

        return list;
    }
}

public record MockEtfSummary(string Id, string Name);

public sealed class MiscRepository(IMapPerformanceBuilder builder) : IMiscRepository
{
    private static readonly string[] SampleSentences =
    [
        "Global markets reacted to central bank guidance amid shifting rate expectations.",
        "Institutional investors adjusted equity exposure ahead of key inflation releases.",
        "Cross-border capital flows showed mixed momentum across major regional benchmarks.",
        "Analysts highlighted earnings resilience despite elevated financing costs.",
        "Liquidity conditions remained steady across sovereign debt and equity desks."
    ];

    private readonly IReadOnlyList<MockEtfSummary> _etfs = CreateEtfs();

    public async Task<TopNewsDataDto> FetchTopNews(IReadOnlyList<string> countries)
    {
        var country = PickCountry(countries);
        var nowUnixMs = DateTimeOffset.UtcNow.ToUnixTimeMilliseconds();

        var items = Enumerable.Range(0, 10)
            .Select(i =>
            {
                var rawSentiment = RandomExtensions.NextDouble(-1.0, 1.0);
                var sentiment = Math.Round(rawSentiment, 2);

                return new TopNewsDto(
                    Id: i,
                    Text: SampleSentences[Random.Shared.Next(SampleSentences.Length)],
                    Date: nowUnixMs,
                    Sentiment: sentiment,
                    Country: country,
                    Source: "Reuters",
                    Description:
                    $"{SampleSentences[Random.Shared.Next(SampleSentences.Length)]} {SampleSentences[Random.Shared.Next(SampleSentences.Length)]}"
                );
            })
            .ToList();

        return await Task.FromResult(new TopNewsDataDto(items, DateTime.UtcNow));
    }

    public async Task<IndicePerformanceDataDto> FetchIndicesPerformance()
    {
        List<IndicePerformanceDto> values =
        [
            new(1, "S&P 500", "USA", RandomExtensions.NextDouble(-0.05, 0.05), 6880),
            new(2, "Nikkei 225", "JPN", RandomExtensions.NextDouble(-0.05, 0.05), 43274),
            new(3, "DAX", "DEU", RandomExtensions.NextDouble(-0.05, 0.05), 24189),
            new(4, "FTSE 100", "GBR", RandomExtensions.NextDouble(-0.05, 0.05), 9165),
            new(5, "Stoxx 50", "FRA", RandomExtensions.NextDouble(-0.05, 0.05), 5389),
            new(6, "IBEX 35", "ESP", RandomExtensions.NextDouble(-0.05, 0.05), 15021),
            new(7, "Shanghai Composite", "CHN", RandomExtensions.NextDouble(-0.05, 0.05), 3700),
            new(8, "Sensex 30", "IND", RandomExtensions.NextDouble(-0.05, 0.05), 67000),
            new(9, "ASX 200", "AUS", RandomExtensions.NextDouble(-0.05, 0.05), 7150),
            new(10, "KOSPI", "KOR", RandomExtensions.NextDouble(-0.05, 0.05), 2760)
        ];

        return await Task.FromResult(new IndicePerformanceDataDto(values, DateTime.UtcNow));
    }

    public async Task<SectorPerformanceDataDto> FetchSectorPerformance(IReadOnlyList<string> countries)
    {
        var country = PickCountry(countries);

        var values = Enum.GetValues<SectorType>()
            .Select(type => new SectorPerformanceDto(
                Type: type,
                Change: RandomExtensions.NextDouble(-0.05, 0.05),
                Country: country
            ))
            .ToList();

        return await Task.FromResult(new SectorPerformanceDataDto(values, DateTime.UtcNow));
    }

    public async Task<IReadOnlyList<EquityDto>> FetchWorldEquityAsync()
    {
        IReadOnlyList<EquityDto> equities = Enum.GetValues<CountryType>()
            .Select(country => new EquityDto(
                Country: country,
                Change: RandomExtensions.NextDouble(-0.3, 0.3),
                LastPrice: RandomExtensions.NextDouble(1.0, 100.0),
                Volume: Random.Shared.NextInt64(100, 1000)
            ))
            .ToList();

        return await Task.FromResult(equities);
    }

    public async Task<IReadOnlyList<TreeMapDto>> FetchMapPerformance()
    {
        return await builder.BuildMapPerformanceAsync();
    }

    public async Task<TopIndustriesDataDto> FetchTopIndustries(IReadOnlyList<string> countries, string period)
    {
        _ = int.TryParse(string.IsNullOrWhiteSpace(period) ? "1" : period, out _);
        var country = PickCountry(countries);

        var items = Enum.GetValues<SectorType>()
            .Select(type => new TopIndustriesDto(
                Type: type,
                Change: RandomExtensions.NextDouble(-0.05, 0.05),
                Country: country
            ))
            .OrderBy(x => x.Change)
            .Take(5)
            .ToList();

        return await Task.FromResult(new TopIndustriesDataDto(items, DateTime.UtcNow));
    }

    public async Task<WorstIndustriesDataDto> FetchWorstIndustries(IReadOnlyList<string> countries, string period)
    {
        _ = int.TryParse(string.IsNullOrWhiteSpace(period) ? "1" : period, out _);
        var country = PickCountry(countries);

        var items = Enum.GetValues<SectorType>()
            .Select(sector => new WorstIndustriesDto(
                Type: sector,
                Change: RandomExtensions.NextDouble(-0.05, 0.05),
                Country: country
            ))
            .OrderBy(x => x.Change)
            .Take(5)
            .ToList();

        return await Task.FromResult(new WorstIndustriesDataDto(items, DateTime.UtcNow));
    }

    public async Task<GainersDataDto> FetchGainers(IReadOnlyList<string> countries, string? period = null)
    {
        var country = PickCountry(countries);

        var items = Enum.GetValues<SectorType>()
            .Select(type => new GainersDto(
                Type: type,
                Change: RandomExtensions.NextDouble(-0.1, 0.2),
                Country: country
            ))
            .OrderByDescending(x => x.Change)
            .Take(5)
            .ToList();

        return await Task.FromResult(new GainersDataDto(items, DateTime.UtcNow));
    }

    public async Task<LosersDataDto> FetchLosers(IReadOnlyList<string> countries, string? period = null)
    {
        _ = int.TryParse(string.IsNullOrWhiteSpace(period) ? "1" : period, out _);
        var country = PickCountry(countries);

        var items = Enum.GetValues<SectorType>()
            .Select(type => new LosersDto(
                Type: type,
                Change: RandomExtensions.NextDouble(-0.5, 0.2),
                Country: country
            ))
            .OrderBy(x => x.Change)
            .Take(5)
            .ToList();

        return await Task.FromResult(new LosersDataDto(items, DateTime.UtcNow));
    }

    private static string PickCountry(IReadOnlyList<string> countries) =>
        countries.Count > 0 ? countries[Random.Shared.Next(countries.Count)] : "N/A";


    private static List<MockEtfSummary> CreateEtfs() =>
    [
        new("1", "ETF A"),
        new("2", "ETF B"),
        new("3", "ETF C"),
        new("4", "ETF D"),
        new("5", "ETF E")
    ];
}
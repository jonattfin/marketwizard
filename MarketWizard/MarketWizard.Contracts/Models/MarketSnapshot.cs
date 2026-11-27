namespace MarketWizard.Contracts.Models;

public record MarketSnapshot(
    TopNewsDataDto TopNews,
    IndicePerformanceDataDto IndicesPerformance,
    SectorPerformanceDataDto SectorPerformance,
    IReadOnlyList<TreeMapDto> MapPerformance,
    Dictionary<string, TopIndustriesDataDto> TopIndustries,
    Dictionary<string, WorstIndustriesDataDto> WorstIndustries,
    Dictionary<string, GainersDataDto> Gainers,
    Dictionary<string, LosersDataDto> Losers);
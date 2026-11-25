using MarketWizard.Contracts.Models;

namespace MarketWizard.Contracts.Interfaces;

public interface IMiscRepository
{
    Task<TopNewsDataDto> FetchTopNews(IReadOnlyList<string>? countries = null);
    Task<IndicePerformanceDataDto> FetchIndicesPerformance();
    Task<SectorPerformanceDataDto> FetchSectorPerformance(IReadOnlyList<string> countries);
    Task<IReadOnlyList<TreeMapDto>> FetchMapPerformance();
    Task<TopIndustriesDataDto> FetchTopIndustries(IReadOnlyList<string> countries, string period);
    Task<WorstIndustriesDataDto> FetchWorstIndustries(IReadOnlyList<string> countries, string period);
    Task<GainersDataDto> FetchGainers(IReadOnlyList<string> countries, string? period = null);
    Task<LosersDataDto> FetchLosers(IReadOnlyList<string> countries, string? period = null);
}
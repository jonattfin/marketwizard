using MarketWizard.Contracts.Models;

namespace MarketWizard.Contracts.Interfaces;

public interface IMarketSyncRepository
{
    Task<TopNewsDataDto> FetchFreshTopNews();
    Task<IndicePerformanceDataDto> FetchFreshIndicesPerformance();
    Task UpdateCache(TopNewsDataDto topNews, IndicePerformanceDataDto indicesPerformance, CancellationToken cancellationToken);
}
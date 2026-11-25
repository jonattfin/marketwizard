namespace MarketWizard.Contracts.Interfaces;

public interface ICronJobRepository
{
    public Task SaveAsync(string? topNews, string? indexPerformance, CancellationToken cancellationToken = default);
    
    public Task<string?> GetIndexPerformance(CancellationToken cancellationToken = default);
    public Task<string?> GetTopNews(CancellationToken cancellationToken = default);
}
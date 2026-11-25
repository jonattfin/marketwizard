using System.Linq.Expressions;
using MarketWizard.Contracts.Interfaces;
using MarketWizard.Infrastructure.Persistence;
using MarketWizard.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarketWizard.Infrastructure.Repositories;

public class CronJobRepository(MarketWizardContext context) : ICronJobRepository
{
    public async Task SaveAsync(string? topNews, string? indexPerformance, CancellationToken cancellationToken = default)
    {
        await context.CronJobs.AddAsync(new CronJob
        {
            Id = Guid.NewGuid(),
            Date = DateTime.UtcNow,
            TopNews = topNews,
            IndexPerformance = indexPerformance,
        }, cancellationToken);
        
        await context.SaveChangesAsync(cancellationToken);
    }
    
    public async Task<string?> GetIndexPerformance(CancellationToken cancellationToken = default)
    {
        return await GetLast(x => x.IndexPerformance, cancellationToken);
    }

    public async Task<string?> GetTopNews(CancellationToken cancellationToken = default)
    {
        return await GetLast(x => x.TopNews, cancellationToken);
    }

    private async Task<T?> GetLast<T>(
        Expression<Func<CronJob, T?>> selector,
        CancellationToken cancellationToken = default)
    {
        return await context.CronJobs
            .OrderByDescending(x => x.Date)
            .Select(selector)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
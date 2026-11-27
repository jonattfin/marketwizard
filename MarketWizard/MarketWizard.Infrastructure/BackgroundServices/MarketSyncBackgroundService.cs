using MarketWizard.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MarketWizard.Infrastructure.BackgroundServices;

public sealed class DatabaseInitializationService(IServiceScopeFactory scopeFactory) : IHostedService
{
    public async Task StartAsync(CancellationToken cancellationToken)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<MarketWizardContext>();
        await db.Database.EnsureCreatedAsync(cancellationToken);
        // EnsureCreated does not update databases created by earlier versions.
        await db.Database.ExecuteSqlRawAsync(
            "ALTER TABLE \"CronJobs\" ADD COLUMN IF NOT EXISTS \"MapPerformance\" text NULL", cancellationToken);
    }

    public Task StopAsync(CancellationToken cancellationToken) => Task.CompletedTask;
}
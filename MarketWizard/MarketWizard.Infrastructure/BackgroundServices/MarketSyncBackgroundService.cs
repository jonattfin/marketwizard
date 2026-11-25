using System.Text.Json;
using MarketWizard.Contracts.Interfaces;
using MarketWizard.Infrastructure.Persistence;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace MarketWizard.Infrastructure.BackgroundServices;

public sealed class MarketSyncBackgroundService(
    IServiceScopeFactory scopeFactory,
    ILogger<MarketSyncBackgroundService> logger) : BackgroundService
{
    private readonly TimeSpan _interval = TimeSpan.FromMinutes(1);

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await EnsureDatabaseCreatedAsync(stoppingToken);

        using var timer = new PeriodicTimer(_interval);

        do
        {
            await ExecuteTickAsync(stoppingToken);
        } while (await timer.WaitForNextTickAsync(stoppingToken));
    }

    private async Task EnsureDatabaseCreatedAsync(CancellationToken stoppingToken)
    {
        await using var scope = scopeFactory.CreateAsyncScope();
        var db = scope.ServiceProvider.GetRequiredService<MarketWizardContext>();
        await db.Database.EnsureCreatedAsync(stoppingToken);
    }

    private async Task ExecuteTickAsync(CancellationToken stoppingToken)
    {
        try
        {
            await using var scope = scopeFactory.CreateAsyncScope();

            var miscRepo = scope.ServiceProvider.GetRequiredService<IMiscRepository>();
            var cronJobRepository = scope.ServiceProvider.GetRequiredService<ICronJobRepository>();

            var topNews = await miscRepo.FetchTopNews();
            var indicesPerformance = await miscRepo.FetchIndicesPerformance();

            await cronJobRepository.SaveAsync(
                JsonSerializer.Serialize(topNews),
                JsonSerializer.Serialize(indicesPerformance),
                stoppingToken);

            logger.LogInformation("Saved cron job");
        }
        catch (OperationCanceledException) when (stoppingToken.IsCancellationRequested)
        {
            // Clean shutdown
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Failed to run NewsCronWorker tick");
        }
    }
}
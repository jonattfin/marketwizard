using Coravel;
using MarketWizard.Contracts.Interfaces;
using MarketWizard.Infrastructure.BackgroundServices;
using MarketWizard.Infrastructure.Persistence;
using MarketWizard.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MarketWizard.Infrastructure;

public static class ServiceRegistration
{
    public static void UseMarketSyncScheduler(this IServiceProvider services) =>
        services.UseScheduler(scheduler => scheduler.Schedule<MarketSyncJob>()
            .EveryFiveMinutes()
            .PreventOverlapping(nameof(MarketSyncJob))
            .RunOnceAtStart());

    public static TBuilder AddInfrastructureServices<TBuilder>(this TBuilder builder) where TBuilder : IHostApplicationBuilder
    {
        builder.AddNpgsqlDbContext<MarketWizardContext>("MarketWizard");
        builder.AddRedisDistributedCache("MarketWizardCache");
        builder.Services.AddScoped<ICronJobRepository, CronJobRepository>();
        
        builder.Services.AddSingleton<IMapPerformanceBuilder, MapPerformanceBuilder>();
        builder.Services.AddSingleton<MiscRepository>();
        builder.Services.AddSingleton<CachedMiscRepository>(services => new CachedMiscRepository(
            services.GetRequiredService<MiscRepository>(),
            services.GetRequiredService<Microsoft.Extensions.Caching.Distributed.IDistributedCache>(),
            services.GetRequiredService<Microsoft.Extensions.Logging.ILogger<CachedMiscRepository>>()));
        builder.Services.AddSingleton<IMiscRepository>(services => services.GetRequiredService<CachedMiscRepository>());
        builder.Services.AddSingleton<IMarketSyncRepository>(services => services.GetRequiredService<CachedMiscRepository>());
        builder.Services.AddSingleton<IPortfolioRepository, PortfolioRepository>();
        builder.Services.AddSingleton<IEtfRepository, EtfRepository>();

        builder.Services.AddHostedService<DatabaseInitializationService>();
        builder.Services.AddTransient<MarketSyncJob>();
        builder.Services.AddScheduler();
        
        return builder;
    }
}
using MarketWizard.Contracts.Interfaces;
using MarketWizard.Infrastructure.BackgroundServices;
using MarketWizard.Infrastructure.Persistence;
using MarketWizard.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MarketWizard.Infrastructure;

public static class ServiceRegistration
{
    public static TBuilder AddInfrastructureServices<TBuilder>(this TBuilder builder) where TBuilder : IHostApplicationBuilder
    {
        builder.AddNpgsqlDbContext<MarketWizardContext>("MarketWizard");
        builder.Services.AddScoped<ICronJobRepository, CronJobRepository>();
        
        builder.Services.AddSingleton<IMapPerformanceBuilder, MapPerformanceBuilder>();
        builder.Services.AddSingleton<IMiscRepository, MiscRepository>();
        builder.Services.AddSingleton<IPortfolioRepository, PortfolioRepository>();
        builder.Services.AddSingleton<IEtfRepository, EtfRepository>();

        builder.Services.AddHostedService<MarketSyncBackgroundService>();
        
        return builder;
    }
}
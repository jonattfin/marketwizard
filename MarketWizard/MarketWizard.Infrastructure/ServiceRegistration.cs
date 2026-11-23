using MarketWizard.Contracts.Interfaces;
using MarketWizard.Infrastructure.Repositories;
using Microsoft.Extensions.DependencyInjection;

namespace MarketWizard.Infrastructure;

public static class ServiceRegistration
{
    public static IServiceCollection AddInfrastructureServices(this IServiceCollection services)
    {
        services.AddSingleton<IMapPerformanceBuilder, MapPerformanceBuilder>();
        services.AddSingleton<IMiscRepository, MiscRepository>();
        services.AddSingleton<IPortfolioRepository, PortfolioRepository>();
        services.AddSingleton<IEtfRepository, EtfRepository>();

        return services;
    }
}
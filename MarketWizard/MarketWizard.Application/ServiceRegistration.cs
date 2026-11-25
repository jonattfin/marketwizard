using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;

namespace MarketWizard.Application;

public static class ServiceRegistration
{
    public static TBuilder AddApplicationServices<TBuilder>(this TBuilder builder) where TBuilder : IHostApplicationBuilder
    {
        builder.Services.AddScoped<IAppService, AppService>();
        
        return builder;
    }
}
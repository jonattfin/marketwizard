using MarketWizard.Server.Models;

namespace MarketWizard.Server.Extensions;

public static class GraphQLExtensions
{
    public static IServiceCollection AddGraphQLServices(this IServiceCollection services)
    {
        services.AddGraphQLServer().AddQueryType<Query>();

        return services;
    }
}
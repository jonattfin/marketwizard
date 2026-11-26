using MarketWizard.Server.Models;
using MarketWizard.Application.Notifications;
using MediatR;

namespace MarketWizard.Server.Extensions;

public static class GraphQLExtensions
{
    public static IServiceCollection AddGraphQLServices(this IServiceCollection services)
    {
        services.AddTransient<INotificationHandler<MarketDataUpdatedNotification>, MarketDataUpdatedHandler>();
        services.AddGraphQLServer().AddQueryType<Query>().AddSubscriptionType<Subscription>().AddInMemorySubscriptions();

        return services;
    }
}
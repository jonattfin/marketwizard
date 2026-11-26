using HotChocolate.Subscriptions;
using MarketWizard.Application.Notifications;
using MediatR;

namespace MarketWizard.Server.Models;

public record MarketDataUpdate(DateTime UpdatedAt, string[] Fields);

public class Subscription
{
    [Subscribe]
    public MarketDataUpdate MarketDataUpdated([EventMessage] MarketDataUpdate update) => update;
}

public class MarketDataUpdatedHandler(ITopicEventSender sender) : INotificationHandler<MarketDataUpdatedNotification>
{
    public async Task Handle(MarketDataUpdatedNotification notification, CancellationToken cancellationToken)
    {
        await sender.SendAsync(nameof(Subscription.MarketDataUpdated),
            new MarketDataUpdate(notification.UpdatedAt, ["indices", "topNews"]), cancellationToken);
    }
}
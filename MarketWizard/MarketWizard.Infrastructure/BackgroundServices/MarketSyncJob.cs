using Coravel.Invocable;
using MarketWizard.Application.Notifications;
using MediatR;
using Microsoft.Extensions.Logging;

namespace MarketWizard.Infrastructure.BackgroundServices;

public sealed class MarketSyncJob(IPublisher publisher, ILogger<MarketSyncJob> logger) : IInvocable, ICancellableInvocable
{
    public CancellationToken CancellationToken { get; set; }

    public async Task Invoke()
    {
        await publisher.Publish(new MarketSyncNotification(), CancellationToken);
        logger.LogInformation("Saved cron job");
    }
}
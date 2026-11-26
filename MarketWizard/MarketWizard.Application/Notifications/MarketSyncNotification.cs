using System.Text.Json;
using MarketWizard.Contracts.Interfaces;
using MediatR;

namespace MarketWizard.Application.Notifications;

public record MarketSyncNotification : INotification;

public class MarketSyncNotificationHandler(IMarketSyncRepository miscRepository, ICronJobRepository cronJobRepository)
    : INotificationHandler<MarketSyncNotification>
{
    public async Task Handle(MarketSyncNotification notification, CancellationToken cancellationToken)
    {
        var topNews = await miscRepository.FetchFreshTopNews();
        var indicesPerformance = await miscRepository.FetchFreshIndicesPerformance();

        await cronJobRepository.SaveAsync(
            JsonSerializer.Serialize(topNews),
            JsonSerializer.Serialize(indicesPerformance),
            cancellationToken);
        await miscRepository.UpdateCache(topNews, indicesPerformance, cancellationToken);
    }
}
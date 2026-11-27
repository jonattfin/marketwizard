using MarketWizard.Contracts.Interfaces;
using MarketWizard.Contracts.Models;
using MediatR;

namespace MarketWizard.Application.Notifications;

public record MarketSyncNotification : INotification;

public record MarketDataUpdatedNotification(DateTime UpdatedAt) : INotification;

public class MarketSyncNotificationHandler(IMiscRepository miscRepository, ICronJobRepository cronJobRepository, IPublisher publisher)
    : INotificationHandler<MarketSyncNotification>
{
    public async Task Handle(MarketSyncNotification notification, CancellationToken cancellationToken)
    {
        string[] countries = ["AUS", "CHN", "DEU", "ESP", "FRA", "GBR", "IND", "JPN", "KOR", "USA"];
        string[] periods = ["1", "2", "3", "4", "5"];
        var news = new List<TopNewsDto>();
        var sectors = new List<SectorPerformanceDto>();
        var top = periods.ToDictionary(period => period, _ => new List<TopIndustriesDto>());
        var worst = periods.ToDictionary(period => period, _ => new List<WorstIndustriesDto>());
        var gainers = periods.ToDictionary(period => period, _ => new List<GainersDto>());
        var losers = periods.ToDictionary(period => period, _ => new List<LosersDto>());

        var indices = await miscRepository.FetchIndicesPerformance();
        var map = await miscRepository.FetchMapPerformance();
        foreach (var country in countries)
        {
            cancellationToken.ThrowIfCancellationRequested();
            string[] selection = [country];
            news.AddRange((await miscRepository.FetchTopNews(selection)).Items);
            sectors.AddRange((await miscRepository.FetchSectorPerformance(selection)).Items);
            foreach (var period in periods)
            {
                cancellationToken.ThrowIfCancellationRequested();
                top[period].AddRange((await miscRepository.FetchTopIndustries(selection, period)).Items);
                worst[period].AddRange((await miscRepository.FetchWorstIndustries(selection, period)).Items);
                gainers[period].AddRange((await miscRepository.FetchGainers(selection, period)).Items);
                losers[period].AddRange((await miscRepository.FetchLosers(selection, period)).Items);
            }
        }

        var now = DateTime.UtcNow;
        var snapshot = new MarketSnapshot(
            new TopNewsDataDto(news, now), indices, new SectorPerformanceDataDto(sectors, now), map,
            top.ToDictionary(pair => pair.Key, pair => new TopIndustriesDataDto(pair.Value, now)),
            worst.ToDictionary(pair => pair.Key, pair => new WorstIndustriesDataDto(pair.Value, now)),
            gainers.ToDictionary(pair => pair.Key, pair => new GainersDataDto(pair.Value, now)),
            losers.ToDictionary(pair => pair.Key, pair => new LosersDataDto(pair.Value, now)));
        await cronJobRepository.SaveAsync(snapshot, cancellationToken);
        await publisher.Publish(new MarketDataUpdatedNotification(DateTime.UtcNow), cancellationToken);
    }
}
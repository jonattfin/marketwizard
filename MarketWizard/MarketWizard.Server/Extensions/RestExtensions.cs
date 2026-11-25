using MarketWizard.Application;
using MarketWizard.Contracts.Interfaces;

namespace MarketWizard.Server.Extensions;

public static class RestExtensions
{
    public static void MapRestEndpoints(this RouteGroupBuilder api)
    {
        api.MapGet("indices", async (IAppService appService) => await appService.MiscRepository.FetchIndicesPerformance())
            .WithName("GetIndices");

        api.MapGet("top-news",
                async (IAppService appService, string[] countries, CancellationToken cancellationToken) =>
                {
                    var topNews = await appService.MiscRepository.FetchTopNews(countries);

                    var topNews2 = await appService.CronJobRepository.GetTopNews(cancellationToken);

                    return topNews;
                })
            .WithName("GetNews");

        api.MapGet("top-gainers",
                async (IAppService appService, string[] countries, string period) =>
                    await appService.MiscRepository.FetchGainers(countries, period))
            .WithName("GetTopGainers");

        api.MapGet("top-losers",
                async (IAppService appService, string[] countries, string period) =>
                    await appService.MiscRepository.FetchLosers(countries, period))
            .WithName("GetTopLosers");

        api.MapGet("top-industries",
                async (IAppService appService, string[] countries, string period) =>
                    await appService.MiscRepository.FetchTopIndustries(countries, period))
            .WithName("GetTopIndustries");

        api.MapGet("worst-industries",
                async (IAppService appService, string[] countries, string period) =>
                    await appService.MiscRepository.FetchWorstIndustries(countries, period))
            .WithName("GetWorstIndustries");

        api.MapGet("sector-performance",
                async (IAppService appService, string[] countries) =>
                    await appService.MiscRepository.FetchSectorPerformance(countries))
            .WithName("GetSectorPerformance");

        api.MapGet("map-performance",
                async (IAppService appService) =>
                    await appService.MiscRepository.FetchMapPerformance())
            .WithName("GetMapPerformance");

        api.MapGet("lazy-portfolios",
                async (IPortfolioRepository repository) =>
                    await repository.FetchLazyPortfolios())
            .WithName("GetLazyPortfolios");

        api.MapGet("lazy-portfolios/{id:int}",
                async (IPortfolioRepository repository, int id) =>
                    await repository.FetchLazyPortfolioById(id))
            .WithName("GetLazyPortfolioById");

        api.MapGet("etf",
                async (IEtfRepository repository) =>
                    await repository.FetchEtfs())
            .WithName("GetEtfs");

        api.MapGet("etf/{id}",
                async (IEtfRepository repository, string id) =>
                    await repository.FetchEtfById(id))
            .WithName("GetEtfById");
    }
}
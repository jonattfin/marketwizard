using MarketWizard.Contracts.Interfaces;

namespace MarketWizard.Server.Extensions;

public static class RestExtensions
{
    public static void MapRestEndpoints(this RouteGroupBuilder api)
    {
        api.MapGet("indices", async (IMiscRepository repository) => await repository.FetchIndicesPerformance())
            .WithName("GetIndices");

        api.MapGet("top-news",
                async (IMiscRepository repository, string[] countries) => await repository.FetchTopNews(countries))
            .WithName("GetNews");

        api.MapGet("top-gainers",
                async (IMiscRepository repository, string[] countries, string period) =>
                    await repository.FetchGainers(countries, period))
            .WithName("GetTopGainers");

        api.MapGet("top-losers",
                async (IMiscRepository repository, string[] countries, string period) =>
                    await repository.FetchLosers(countries, period))
            .WithName("GetTopLosers");

        api.MapGet("top-industries",
                async (IMiscRepository repository, string[] countries, string period) =>
                    await repository.FetchTopIndustries(countries, period))
            .WithName("GetTopIndustries");

        api.MapGet("worst-industries",
                async (IMiscRepository repository, string[] countries, string period) =>
                    await repository.FetchWorstIndustries(countries, period))
            .WithName("GetWorstIndustries");

        api.MapGet("sector-performance",
                async (IMiscRepository repository, string[] countries) =>
                    await repository.FetchSectorPerformance(countries))
            .WithName("GetSectorPerformance");

        api.MapGet("map-performance",
                async (IMiscRepository repository) =>
                    await repository.FetchMapPerformance())
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
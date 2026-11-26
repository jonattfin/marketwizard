using MarketWizard.Application.Queries;
using MediatR;

namespace MarketWizard.Server.Extensions;

public static class RestExtensions
{
    public static void MapRestEndpoints(this RouteGroupBuilder api)
    {
        api.MapGet("indices", async (ISender sender, CancellationToken cancellationToken) => await sender.Send(new GetIndicesQuery(), cancellationToken))
            .WithName("GetIndices");

        api.MapGet("top-news",
                async (ISender sender, string[] countries, CancellationToken cancellationToken) =>
                    await sender.Send(new GetTopNewsQuery(countries), cancellationToken))
            .WithName("GetNews");

        api.MapGet("top-gainers",
                async (ISender sender, string[] countries, string period, CancellationToken cancellationToken) =>
                    await sender.Send(new GetGainersQuery(countries, period), cancellationToken))
            .WithName("GetTopGainers");

        api.MapGet("top-losers",
                async (ISender sender, string[] countries, string period, CancellationToken cancellationToken) =>
                    await sender.Send(new GetLosersQuery(countries, period), cancellationToken))
            .WithName("GetTopLosers");

        api.MapGet("top-industries",
                async (ISender sender, string[] countries, string period, CancellationToken cancellationToken) =>
                    await sender.Send(new GetTopIndustriesQuery(countries, period), cancellationToken))
            .WithName("GetTopIndustries");

        api.MapGet("worst-industries",
                async (ISender sender, string[] countries, string period, CancellationToken cancellationToken) =>
                    await sender.Send(new GetWorstIndustriesQuery(countries, period), cancellationToken))
            .WithName("GetWorstIndustries");

        api.MapGet("sector-performance",
                async (ISender sender, string[] countries, CancellationToken cancellationToken) =>
                    await sender.Send(new GetSectorPerformanceQuery(countries), cancellationToken))
            .WithName("GetSectorPerformance");

        api.MapGet("map-performance",
                async (ISender sender, CancellationToken cancellationToken) =>
                    await sender.Send(new GetMapPerformanceQuery(), cancellationToken))
            .WithName("GetMapPerformance");

        api.MapGet("lazy-portfolios",
                async (ISender sender, CancellationToken cancellationToken) =>
                    await sender.Send(new GetLazyPortfoliosQuery(), cancellationToken))
            .WithName("GetLazyPortfolios");

        api.MapGet("lazy-portfolios/{id:int}",
                async (ISender sender, int id, CancellationToken cancellationToken) =>
                    await sender.Send(new GetLazyPortfolioByIdQuery(id), cancellationToken))
            .WithName("GetLazyPortfolioById");

        api.MapGet("etf",
                async (ISender sender, CancellationToken cancellationToken) =>
                    await sender.Send(new GetEtfsQuery(), cancellationToken))
            .WithName("GetEtfs");

        api.MapGet("etf/{id}",
                async (ISender sender, string id, CancellationToken cancellationToken) =>
                    await sender.Send(new GetEtfByIdQuery(id), cancellationToken))
            .WithName("GetEtfById");
    }
}
using MarketWizard.Application.Queries;
using MarketWizard.Contracts.Models;
using MediatR;

namespace MarketWizard.Server.Models;

public class Query
{
    public Task<IndicePerformanceDataDto> GetIndices(ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetIndicesQuery(), cancellationToken);

    public Task<TopNewsDataDto> GetTopNews(string[] countries, ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetTopNewsQuery(countries), cancellationToken);

    public Task<GainersDataDto> GetTopGainers(string[] countries, string period, ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetGainersQuery(countries, period), cancellationToken);

    public Task<LosersDataDto> GetTopLosers(string[] countries, string period, ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetLosersQuery(countries, period), cancellationToken);

    public Task<TopIndustriesDataDto> GetTopIndustries(string[] countries, string period, ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetTopIndustriesQuery(countries, period), cancellationToken);

    public Task<WorstIndustriesDataDto> GetWorstIndustries(string[] countries, string period, ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetWorstIndustriesQuery(countries, period), cancellationToken);

    public Task<SectorPerformanceDataDto> GetSectorPerformance(string[] countries, ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetSectorPerformanceQuery(countries), cancellationToken);

    public Task<IReadOnlyList<TreeMapDto>> GetMapPerformance(ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetMapPerformanceQuery(), cancellationToken);

    public Task<LazyPortfolioDtoItems> GetLazyPortfolios(ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetLazyPortfoliosQuery(), cancellationToken);

    public Task<LazyPortfolioDto?> GetLazyPortfolioById(int id, ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetLazyPortfolioByIdQuery(id), cancellationToken);

    public Task<IReadOnlyList<EtfThemeDto>> GetEtfs(ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetEtfsQuery(), cancellationToken);

    public Task<EtfThemeByIdDto?> GetEtfById(string id, ISender sender, CancellationToken cancellationToken) =>
        sender.Send(new GetEtfByIdQuery(id), cancellationToken);
}
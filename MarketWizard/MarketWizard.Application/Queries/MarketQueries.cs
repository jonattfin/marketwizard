using MarketWizard.Contracts.Interfaces;
using MarketWizard.Contracts.Models;
using MediatR;

namespace MarketWizard.Application.Queries;

public record GetIndicesQuery : IRequest<IndicePerformanceDataDto>;
public record GetTopNewsQuery(string[] Countries) : IRequest<TopNewsDataDto>;
public record GetGainersQuery(string[] Countries, string Period) : IRequest<GainersDataDto>;
public record GetLosersQuery(string[] Countries, string Period) : IRequest<LosersDataDto>;
public record GetTopIndustriesQuery(string[] Countries, string Period) : IRequest<TopIndustriesDataDto>;
public record GetWorstIndustriesQuery(string[] Countries, string Period) : IRequest<WorstIndustriesDataDto>;
public record GetSectorPerformanceQuery(string[] Countries) : IRequest<SectorPerformanceDataDto>;
public record GetMapPerformanceQuery : IRequest<IReadOnlyList<TreeMapDto>>;
public record GetLazyPortfoliosQuery : IRequest<LazyPortfolioDtoItems>;
public record GetLazyPortfolioByIdQuery(int Id) : IRequest<LazyPortfolioDto?>;
public record GetEtfsQuery : IRequest<IReadOnlyList<EtfThemeDto>>;
public record GetEtfByIdQuery(string Id) : IRequest<EtfThemeByIdDto?>;

public class GetIndicesHandler(IMiscRepository repository) : IRequestHandler<GetIndicesQuery, IndicePerformanceDataDto>
{
    public Task<IndicePerformanceDataDto> Handle(GetIndicesQuery request, CancellationToken cancellationToken) => repository.FetchIndicesPerformance();
}

public class GetTopNewsHandler(IMiscRepository repository, ICronJobRepository cronJobRepository) : IRequestHandler<GetTopNewsQuery, TopNewsDataDto>
{
    public async Task<TopNewsDataDto> Handle(GetTopNewsQuery request, CancellationToken cancellationToken)
    {
        var topNews = await repository.FetchTopNews(request.Countries);
        await cronJobRepository.GetTopNews(cancellationToken);
        return topNews;
    }
}

public class GetGainersHandler(IMiscRepository repository) : IRequestHandler<GetGainersQuery, GainersDataDto>
{
    public Task<GainersDataDto> Handle(GetGainersQuery request, CancellationToken cancellationToken) => repository.FetchGainers(request.Countries, request.Period);
}

public class GetLosersHandler(IMiscRepository repository) : IRequestHandler<GetLosersQuery, LosersDataDto>
{
    public Task<LosersDataDto> Handle(GetLosersQuery request, CancellationToken cancellationToken) => repository.FetchLosers(request.Countries, request.Period);
}

public class GetTopIndustriesHandler(IMiscRepository repository) : IRequestHandler<GetTopIndustriesQuery, TopIndustriesDataDto>
{
    public Task<TopIndustriesDataDto> Handle(GetTopIndustriesQuery request, CancellationToken cancellationToken) => repository.FetchTopIndustries(request.Countries, request.Period);
}

public class GetWorstIndustriesHandler(IMiscRepository repository) : IRequestHandler<GetWorstIndustriesQuery, WorstIndustriesDataDto>
{
    public Task<WorstIndustriesDataDto> Handle(GetWorstIndustriesQuery request, CancellationToken cancellationToken) => repository.FetchWorstIndustries(request.Countries, request.Period);
}

public class GetSectorPerformanceHandler(IMiscRepository repository) : IRequestHandler<GetSectorPerformanceQuery, SectorPerformanceDataDto>
{
    public Task<SectorPerformanceDataDto> Handle(GetSectorPerformanceQuery request, CancellationToken cancellationToken) => repository.FetchSectorPerformance(request.Countries);
}

public class GetMapPerformanceHandler(IMiscRepository repository) : IRequestHandler<GetMapPerformanceQuery, IReadOnlyList<TreeMapDto>>
{
    public Task<IReadOnlyList<TreeMapDto>> Handle(GetMapPerformanceQuery request, CancellationToken cancellationToken) => repository.FetchMapPerformance();
}

public class GetLazyPortfoliosHandler(IPortfolioRepository repository) : IRequestHandler<GetLazyPortfoliosQuery, LazyPortfolioDtoItems>
{
    public Task<LazyPortfolioDtoItems> Handle(GetLazyPortfoliosQuery request, CancellationToken cancellationToken) => repository.FetchLazyPortfolios();
}

public class GetLazyPortfolioByIdHandler(IPortfolioRepository repository) : IRequestHandler<GetLazyPortfolioByIdQuery, LazyPortfolioDto?>
{
    public Task<LazyPortfolioDto?> Handle(GetLazyPortfolioByIdQuery request, CancellationToken cancellationToken) => repository.FetchLazyPortfolioById(request.Id);
}

public class GetEtfsHandler(IEtfRepository repository) : IRequestHandler<GetEtfsQuery, IReadOnlyList<EtfThemeDto>>
{
    public Task<IReadOnlyList<EtfThemeDto>> Handle(GetEtfsQuery request, CancellationToken cancellationToken) => repository.FetchEtfs();
}

public class GetEtfByIdHandler(IEtfRepository repository) : IRequestHandler<GetEtfByIdQuery, EtfThemeByIdDto?>
{
    public Task<EtfThemeByIdDto?> Handle(GetEtfByIdQuery request, CancellationToken cancellationToken) => repository.FetchEtfById(request.Id);
}
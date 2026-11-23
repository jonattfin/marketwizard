using MarketWizard.Server.Models;
using MarketWizard.Server.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();
builder.Services.AddSingleton<IMapPerformanceBuilder, MapPerformanceBuilder>();
builder.Services.AddSingleton<IMiscRepository, MiscRepository>();
builder.Services.AddSingleton<IPortfolioRepository,  PortfolioRepository>();
builder.Services.AddSingleton<IEtfRepository,  EtfRepository>();

builder.Services.AddGraphQLServer().AddQueryType<Query>();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

string[] summaries =
    ["Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"];

var api = app.MapGroup("/api");
api.MapGet("indices", async (IMiscRepository repository) => await repository.FetchIndicesPerformanceAsync())
    .WithName("GetIndices");

api.MapGet("top-news",
        async (IMiscRepository repository, string[] countries) => await repository.FetchTopNewsAsync(countries))
    .WithName("GetNews");

api.MapGet("top-gainers",
        async (IMiscRepository repository, string[] countries, string period) =>
            await repository.FetchGainersAsync(countries, period))
    .WithName("GetTopGainers");

api.MapGet("top-losers",
        async (IMiscRepository repository, string[] countries, string period) =>
            await repository.FetchLosersAsync(countries, period))
    .WithName("GetTopLosers");

api.MapGet("top-industries",
        async (IMiscRepository repository, string[] countries, string period) =>
            await repository.FetchTopIndustriesAsync(countries, period))
    .WithName("GetTopIndustries");

api.MapGet("worst-industries",
        async (IMiscRepository repository, string[] countries, string period) =>
            await repository.FetchWorstIndustriesAsync(countries, period))
    .WithName("GetWorstIndustries");

api.MapGet("sector-performance",
        async (IMiscRepository repository, string[] countries) =>
            await repository.FetchSectorPerformanceAsync(countries))
    .WithName("GetSectorPerformance");

api.MapGet("map-performance",
        async (IMiscRepository repository) =>
            await repository.FetchMapPerformanceAsync())
    .WithName("GetMapPerformance");

api.MapGet("lazy-portfolios",
        async (IPortfolioRepository repository) =>
            await repository.FetchLazyPortfoliosAsync())
    .WithName("GetLazyPortfolios");

api.MapGet("lazy-portfolios/{id:int}",
        async (IPortfolioRepository repository, int id) =>
            await repository.FetchLazyPortfolioByIdAsync(id))
    .WithName("GetLazyPortfolioById");

api.MapGet("etf",
        async (IEtfRepository repository) =>
            await repository.FetchEtfsAsync())
    .WithName("GetEtfs");

api.MapGet("etf/{id}",
        async (IEtfRepository repository, string id) =>
            await repository.FetchEtfByIdAsync(id))
    .WithName("GetEtfById");

app.MapDefaultEndpoints();
app.MapGraphQL();

app.UseFileServer();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}
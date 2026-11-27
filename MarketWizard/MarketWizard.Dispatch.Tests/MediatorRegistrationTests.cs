using MarketWizard.Application;
using System.Reflection;
using MarketWizard.Application.Queries;
using MarketWizard.Contracts.Interfaces;
using MarketWizard.Contracts.Models;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Xunit;

namespace MarketWizard.Dispatch.Tests;

public class MediatorRegistrationTests
{
    [Fact]
    public async Task Market_queries_route_to_cron_repository_with_exact_arguments()
    {
        var builder = Host.CreateApplicationBuilder();
        builder.AddApplicationServices();
        var repository = DispatchProxy.Create<ICronJobRepository, RecordingCronRepository>();
        builder.Services.AddSingleton(repository);
        using var host = builder.Build();
        var sender = host.Services.GetRequiredService<ISender>();
        var recorder = (RecordingCronRepository)repository;
        string[] countries = ["US", "GB"];

        await sender.Send(new GetIndicesQuery());
        await sender.Send(new GetTopNewsQuery(countries));
        await sender.Send(new GetSectorPerformanceQuery(countries));
        await sender.Send(new GetMapPerformanceQuery());
        await sender.Send(new GetTopIndustriesQuery(countries, "2"));
        await sender.Send(new GetWorstIndustriesQuery(countries, "3"));
        await sender.Send(new GetGainersQuery(countries, "4"));
        await sender.Send(new GetLosersQuery(countries, "5"));

        Assert.Equal(new[] { "FetchIndicesPerformance", "FetchTopNews", "FetchSectorPerformance", "FetchMapPerformance",
            "FetchTopIndustries", "FetchWorstIndustries", "FetchGainers", "FetchLosers" }, recorder.Calls.Select(call => call.Method));
        foreach (var call in recorder.Calls.Where(call => call.Arguments.Length > 0))
            Assert.Same(countries, call.Arguments[0]);
        Assert.Equal(new[] { "2", "3", "4", "5" }, recorder.Calls.Where(call => call.Arguments.Length == 2).Select(call => call.Arguments[1]));
    }
    [Fact]
    public async Task Registered_mediator_dispatches_to_repository_handler()
    {
        var builder = Host.CreateApplicationBuilder();
        builder.AddApplicationServices();
        var repository = new RecordingEtfRepository();
        builder.Services.AddSingleton<IEtfRepository>(repository);
        using var host = builder.Build();

        var result = await host.Services.GetRequiredService<ISender>().Send(new GetEtfByIdQuery("theme-42"));

        Assert.Null(result);
        Assert.Equal("theme-42", repository.Id);
    }

    private sealed class RecordingEtfRepository : IEtfRepository
    {
        public string? Id { get; private set; }

        public Task<EtfThemeByIdDto?> FetchEtfById(string id)
        {
            Id = id;
            return Task.FromResult<EtfThemeByIdDto?>(null);
        }

        public Task<IReadOnlyList<EtfThemeDto>> FetchEtfs() => throw new NotSupportedException();
    }
}

public class RecordingCronRepository : DispatchProxy
{
    public List<(string Method, object?[] Arguments)> Calls { get; } = [];

    protected override object? Invoke(MethodInfo? targetMethod, object?[]? args)
    {
        Calls.Add((targetMethod!.Name, args ?? []));
        var resultType = targetMethod.ReturnType.GetGenericArguments().Single();
        return typeof(Task).GetMethod(nameof(Task.FromResult))!.MakeGenericMethod(resultType).Invoke(null, [null]);
    }
}
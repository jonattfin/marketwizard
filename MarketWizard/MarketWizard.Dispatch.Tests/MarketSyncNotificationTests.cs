using System.Text.Json;
using System.Reflection;
using Coravel;
using MarketWizard.Application.Notifications;
using MarketWizard.Contracts.Interfaces;
using MarketWizard.Contracts.Models;
using MarketWizard.Infrastructure;
using MarketWizard.Infrastructure.BackgroundServices;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging.Abstractions;
using Xunit;

namespace MarketWizard.Dispatch.Tests;

public class MarketSyncNotificationTests
{
    [Fact]
    public async Task Scheduler_runs_job_on_start_in_a_scope()
    {
        var saved = new TaskCompletionSource(TaskCreationOptions.RunContinuationsAsynchronously);
        using var host = Host.CreateDefaultBuilder()
            .ConfigureServices(services =>
            {
                services.AddScheduler();
                services.AddTransient<MarketSyncJob>();
                services.AddMediatR(config => config.RegisterServicesFromAssembly(typeof(MarketSyncNotification).Assembly));
                services.AddScoped<IMiscRepository, Misc>();
                services.AddScoped<ICronJobRepository>(_ => new Cron(saved));
            })
            .UseDefaultServiceProvider(options => options.ValidateScopes = true)
            .Build();
        host.Services.UseMarketSyncScheduler();

        await host.StartAsync();
        try
        {
            await saved.Task.WaitAsync(TimeSpan.FromSeconds(15));
        }
        finally
        {
            await host.StopAsync();
        }
    }
    [Fact]
    public async Task Tick_publishes_to_registered_handler_and_saves_projected_results()
    {
        var misc = new Misc();
        var cron = new Cron();
        var services = new ServiceCollection();
        services.AddLogging();
        services.AddMediatR(config => config.RegisterServicesFromAssembly(typeof(MarketSyncNotification).Assembly));
        services.AddSingleton<IMiscRepository>(misc);
        services.AddSingleton<ICronJobRepository>(cron);
        await using var provider = services.BuildServiceProvider();
        var worker = new MarketSyncJob(provider.GetRequiredService<IPublisher>(), NullLogger<MarketSyncJob>.Instance);
        using var cancellation = new CancellationTokenSource();
        worker.CancellationToken = cancellation.Token;

        await worker.Invoke();

        Assert.Equal(10, misc.NewsCalls);
        Assert.Equal(1, misc.IndicesCalls);
        Assert.Equal(misc.Indices, cron.Snapshot!.IndicesPerformance);
        Assert.Equal(5, cron.Snapshot.TopIndustries.Count);
        Assert.Equal(50, misc.PeriodCalls);
        Assert.Equal(cancellation.Token, cron.Token);
        Assert.Equal(1, cron.Saves);
    }

    [Fact]
    public async Task Successful_handler_publishes_update()
    {
        var misc = new Misc();
        var cron = new Cron();
        var publisher = DispatchProxy.Create<IPublisher, RecordingPublisher>();
        var handler = new MarketSyncNotificationHandler(misc, cron, publisher);

        await handler.Handle(new MarketSyncNotification(), CancellationToken.None);

        Assert.Equal(1, cron.Saves);
        Assert.NotNull(cron.Snapshot);
        Assert.IsType<MarketDataUpdatedNotification>(Assert.Single(((RecordingPublisher)publisher).Notifications));
    }

    [Fact]
    public async Task Handler_does_not_publish_when_save_fails()
    {
        var misc = new Misc();
        var publisher = DispatchProxy.Create<IPublisher, RecordingPublisher>();
        var handler = new MarketSyncNotificationHandler(misc, new Cron { Fail = true }, publisher);

        await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(new MarketSyncNotification(), CancellationToken.None));
        Assert.Empty(((RecordingPublisher)publisher).Notifications);
    }

    [Fact]
    public async Task Handler_does_not_save_when_fetch_fails()
    {
        var misc = new Misc { Fail = true };
        var cron = new Cron();
        var publisher = DispatchProxy.Create<IPublisher, RecordingPublisher>();
        var handler = new MarketSyncNotificationHandler(misc, cron, publisher);

        await Assert.ThrowsAsync<InvalidOperationException>(() => handler.Handle(new MarketSyncNotification(), CancellationToken.None));
        Assert.Equal(0, cron.Saves);
        Assert.Empty(((RecordingPublisher)publisher).Notifications);
    }


    private sealed class Cron(TaskCompletionSource? saved = null) : ICronJobRepository
    {
        public MarketSnapshot? Snapshot { get; private set; }
        public CancellationToken Token { get; private set; }
        public int Saves { get; private set; }
        public bool Fail { get; init; }
        public Task SaveAsync(MarketSnapshot snapshot, CancellationToken cancellationToken = default)
        {
            if (Fail) throw new InvalidOperationException();
            Snapshot = snapshot;
            Token = cancellationToken;
            Saves++;
            saved?.TrySetResult();
            return Task.CompletedTask;
        }
        public Task<TopNewsDataDto> FetchTopNews(IReadOnlyList<string>? countries = null) => throw new NotSupportedException();
        public Task<IndicePerformanceDataDto> FetchIndicesPerformance() => throw new NotSupportedException();
        public Task<SectorPerformanceDataDto> FetchSectorPerformance(IReadOnlyList<string> countries) => throw new NotSupportedException();
        public Task<IReadOnlyList<TreeMapDto>> FetchMapPerformance() => throw new NotSupportedException();
        public Task<TopIndustriesDataDto> FetchTopIndustries(IReadOnlyList<string> countries, string period) => throw new NotSupportedException();
        public Task<WorstIndustriesDataDto> FetchWorstIndustries(IReadOnlyList<string> countries, string period) => throw new NotSupportedException();
        public Task<GainersDataDto> FetchGainers(IReadOnlyList<string> countries, string? period = null) => throw new NotSupportedException();
        public Task<LosersDataDto> FetchLosers(IReadOnlyList<string> countries, string? period = null) => throw new NotSupportedException();
    }

    private sealed class Misc : IMiscRepository
    {
        public TopNewsDataDto News { get; } = new([], new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc));
        public IndicePerformanceDataDto Indices { get; } = new([], new DateTime(2025, 1, 2, 0, 0, 0, DateTimeKind.Utc));
        public int NewsCalls { get; private set; }
        public int IndicesCalls { get; private set; }
        public bool Fail { get; init; }
        public int PeriodCalls { get; private set; }
        public Task<TopNewsDataDto> FetchTopNews(IReadOnlyList<string>? countries = null)
        {
            NewsCalls++;
            if (Fail) throw new InvalidOperationException();
            return Task.FromResult(News);
        }
        public Task<IndicePerformanceDataDto> FetchIndicesPerformance() { IndicesCalls++; return Task.FromResult(Indices); }
        public Task<SectorPerformanceDataDto> FetchSectorPerformance(IReadOnlyList<string> countries) => Task.FromResult(new SectorPerformanceDataDto([]));
        public Task<IReadOnlyList<TreeMapDto>> FetchMapPerformance() => Task.FromResult<IReadOnlyList<TreeMapDto>>([]);
        public Task<TopIndustriesDataDto> FetchTopIndustries(IReadOnlyList<string> countries, string period) { PeriodCalls++; return Task.FromResult(new TopIndustriesDataDto([])); }
        public Task<WorstIndustriesDataDto> FetchWorstIndustries(IReadOnlyList<string> countries, string period) => Task.FromResult(new WorstIndustriesDataDto([]));
        public Task<GainersDataDto> FetchGainers(IReadOnlyList<string> countries, string? period = null) => Task.FromResult(new GainersDataDto([]));
        public Task<LosersDataDto> FetchLosers(IReadOnlyList<string> countries, string? period = null) => Task.FromResult(new LosersDataDto([]));
    }
}

public class RecordingPublisher : System.Reflection.DispatchProxy
{
    public List<object> Notifications { get; } = [];

    protected override object? Invoke(System.Reflection.MethodInfo? targetMethod, object?[]? args)
    {
        Notifications.Add(args![0]!);
        return Task.CompletedTask;
    }
}
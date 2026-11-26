using System.Reflection;
using MarketWizard.Server.Extensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace MarketWizard.Dispatch.Tests;

public class RestDispatchTests
{
    [Theory]
    [InlineData("indices")]
    [InlineData("map-performance")]
    [InlineData("lazy-portfolios")]
    [InlineData("etf")]
    public async Task Parameterless_routes_send_one_request(string route)
    {
        await AssertDispatch(route);
    }

    [Theory]
    [InlineData("top-news")]
    [InlineData("sector-performance")]
    [InlineData("top-gainers")]
    [InlineData("top-losers")]
    [InlineData("top-industries")]
    [InlineData("worst-industries")]
    public async Task Country_routes_forward_query_parameters(string route)
    {
        var hasPeriod = route is not ("top-news" or "sector-performance");
        var request = await AssertDispatch(route + "?countries=US&countries=GB" + (hasPeriod ? "&period=week" : ""));

        Assert.Contains(Properties(request), value => value is IEnumerable<string> countries && countries.SequenceEqual(new[] { "US", "GB" }));
        if (hasPeriod)
            Assert.Contains(Properties(request), value => value is string period && period == "week");
    }

    [Fact]
    public async Task Portfolio_detail_forwards_integer_id()
    {
        var request = await AssertDispatch("lazy-portfolios/37");
        Assert.Contains(Properties(request), value => value is int id && id == 37);
    }

    [Fact]
    public async Task Etf_detail_forwards_string_id()
    {
        var request = await AssertDispatch("etf/theme-42");
        Assert.Contains(Properties(request), value => value is string id && id == "theme-42");
    }

    private static IEnumerable<object?> Properties(object request) =>
        request.GetType().GetProperties(BindingFlags.Instance | BindingFlags.Public)
            .Where(property => property.GetIndexParameters().Length == 0)
            .Select(property => property.GetValue(request));

    private static async Task<object> AssertDispatch(string route)
    {
        var mediator = DispatchProxy.Create<IMediator, RecordingMediator>();
        var recorder = (RecordingMediator)mediator;
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        builder.Services.AddSingleton(mediator);
        builder.Services.AddSingleton<ISender>(mediator);
        builder.Services.AddSingleton<IPublisher>(mediator);

        await using var app = builder.Build();
        app.MapGroup("/api").MapRestEndpoints();
        await app.StartAsync();

        using var response = await app.GetTestClient().GetAsync("/api/" + route);
        var request = Assert.Single(recorder.Requests);
        Assert.True(response.IsSuccessStatusCode, $"Unexpected HTTP status: {response.StatusCode}");
        return request;
    }
}

public class RecordingMediator : DispatchProxy
{
    public List<object> Requests { get; } = new();

    protected override object? Invoke(MethodInfo? targetMethod, object?[]? args)
    {
        if (targetMethod?.Name != nameof(ISender.Send) || args is null || args[0] is null)
            throw new NotSupportedException($"Unexpected mediator call: {targetMethod?.Name}");

        Requests.Add(args[0]!);
        var returnType = targetMethod.ReturnType;
        if (returnType == typeof(Task))
            return Task.CompletedTask;

        var resultType = returnType.GetGenericArguments().Single();
        var result = resultType.IsValueType ? Activator.CreateInstance(resultType) : null;
        return typeof(Task).GetMethod(nameof(Task.FromResult))!.MakeGenericMethod(resultType).Invoke(null, new[] { result });
    }
}
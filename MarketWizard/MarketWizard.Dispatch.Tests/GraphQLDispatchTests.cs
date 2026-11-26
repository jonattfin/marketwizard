using System.Net.Http.Json;
using System.Reflection;
using System.Text.Json;
using MarketWizard.Application.Queries;
using MarketWizard.Contracts.Models;
using MarketWizard.Server.Extensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace MarketWizard.Dispatch.Tests;

public class GraphQLDispatchTests
{
    [Fact]
    public async Task Query_forwards_arguments_and_returns_selected_fields()
    {
        var (app, recorder) = await CreateApp();
        await using (app)
        {
            using var response = await app.GetTestClient().PostAsJsonAsync("/graphql", new
            {
                query = "{ topGainers(countries: [\"US\", \"GB\"], period: \"week\") { items { country change } } }"
            });
            var result = await response.Content.ReadFromJsonAsync<JsonElement>();

            Assert.True(response.IsSuccessStatusCode, result.ToString());
            Assert.False(result.TryGetProperty("errors", out _), result.ToString());
            var item = result.GetProperty("data").GetProperty("topGainers").GetProperty("items")[0];
            Assert.Equal("US", item.GetProperty("country").GetString());
            Assert.Equal(2.5, item.GetProperty("change").GetDouble());
            var request = Assert.IsType<GetGainersQuery>(Assert.Single(recorder.Requests));
            Assert.Equal(new[] { "US", "GB" }, request.Countries);
            Assert.Equal("week", request.Period);
        }
    }

    [Theory]
    [InlineData("{ lazyPortfolioById(id: 37) { id } }", typeof(GetLazyPortfolioByIdQuery), 37)]
    [InlineData("{ etfById(id: \"theme-42\") { name } }", typeof(GetEtfByIdQuery), "theme-42")]
    public async Task Missing_detail_returns_null_and_forwards_id(string query, Type requestType, object id)
    {
        var (app, recorder) = await CreateApp();
        await using (app)
        {
            using var response = await app.GetTestClient().PostAsJsonAsync("/graphql", new { query });
            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.True(response.IsSuccessStatusCode, result.ToString());
            Assert.False(result.TryGetProperty("errors", out _), result.ToString());
            Assert.Equal(JsonValueKind.Null, result.GetProperty("data").EnumerateObject().Single().Value.ValueKind);
            var request = Assert.Single(recorder.Requests);
            Assert.Equal(requestType, request.GetType());
            Assert.Equal(id, requestType.GetProperty("Id")!.GetValue(request));
        }
    }

    [Fact]
    public async Task Missing_required_arguments_are_rejected()
    {
        var (app, recorder) = await CreateApp();
        await using (app)
        {
            using var response = await app.GetTestClient().PostAsJsonAsync("/graphql", new { query = "{ topGainers { items { country } } }" });
            var result = await response.Content.ReadFromJsonAsync<JsonElement>();
            Assert.True(result.TryGetProperty("errors", out _), result.ToString());
            Assert.Empty(recorder.Requests);
        }
    }

    private static async Task<(WebApplication App, GraphQLRecordingMediator Recorder)> CreateApp()
    {
        var mediator = DispatchProxy.Create<ISender, GraphQLRecordingMediator>();
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        builder.Services.AddSingleton(mediator);
        builder.Services.AddGraphQLServices();
        var app = builder.Build();
        app.MapGraphQL();
        await app.StartAsync();
        return (app, (GraphQLRecordingMediator)mediator);
    }
}

public class GraphQLRecordingMediator : DispatchProxy
{
    public List<object> Requests { get; } = new();

    protected override object? Invoke(MethodInfo? targetMethod, object?[]? args)
    {
        if (targetMethod?.Name != nameof(ISender.Send) || args is null || args[0] is null)
            throw new NotSupportedException();

        Requests.Add(args[0]!);
        var resultType = targetMethod.ReturnType.GetGenericArguments().Single();
        object? result = args[0] is GetGainersQuery
            ? new GainersDataDto(new List<GainersDto> { new(SectorType.Technology, 2.5, "US") })
            : null;
        return typeof(Task).GetMethod(nameof(Task.FromResult))!.MakeGenericMethod(resultType).Invoke(null, new[] { result });
    }
}
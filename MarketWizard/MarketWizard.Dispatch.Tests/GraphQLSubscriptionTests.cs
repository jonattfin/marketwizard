using System.Net.WebSockets;
using System.Text;
using System.Text.Json;
using MarketWizard.Application.Notifications;
using MarketWizard.Server.Extensions;
using MediatR;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Xunit;

namespace MarketWizard.Dispatch.Tests;

public class GraphQLSubscriptionTests
{
    [Fact]
    public async Task Subscription_delivers_completed_sync_events_over_websocket()
    {
        var builder = WebApplication.CreateBuilder();
        builder.WebHost.UseTestServer();
        builder.Services.AddMediatR(config => config.RegisterServicesFromAssembly(typeof(MarketSyncNotification).Assembly));
        builder.Services.AddGraphQLServices();
        await using var app = builder.Build();
        app.UseWebSockets();
        app.MapGraphQL();
        await app.StartAsync();

        var client = app.GetTestServer().CreateWebSocketClient();
        client.SubProtocols.Add("graphql-transport-ws");
        using var timeout = new CancellationTokenSource(TimeSpan.FromSeconds(10));
        using var socket = await client.ConnectAsync(new Uri("ws://localhost/graphql"), timeout.Token);
        await Send(socket, "{\"type\":\"connection_init\"}", timeout.Token);
        Assert.Equal("connection_ack", (await Receive(socket, timeout.Token)).GetProperty("type").GetString());
        await Send(socket, "{\"id\":\"1\",\"type\":\"subscribe\",\"payload\":{\"query\":\"subscription { marketDataUpdated { updatedAt fields } }\"}}", timeout.Token);

        var receive = Receive(socket, timeout.Token);
        var timestamp = new DateTime(2025, 1, 1, 0, 0, 0, DateTimeKind.Utc);
        while (!receive.IsCompleted)
        {
            await app.Services.GetRequiredService<IPublisher>().Publish(new MarketDataUpdatedNotification(timestamp), timeout.Token);
            await Task.WhenAny(receive, Task.Delay(50, timeout.Token));
            timeout.Token.ThrowIfCancellationRequested();
        }

        var message = await receive;
        Assert.Equal("next", message.GetProperty("type").GetString());
        var update = message.GetProperty("payload").GetProperty("data").GetProperty("marketDataUpdated");
        Assert.Equal(timestamp, update.GetProperty("updatedAt").GetDateTime());
        Assert.Equal(new[] { "indices", "topNews", "sectorPerformance", "mapPerformance", "topIndustries", "worstIndustries", "topGainers", "topLosers" },
            update.GetProperty("fields").EnumerateArray().Select(x => x.GetString()));
    }

    private static Task Send(WebSocket socket, string message, CancellationToken token) =>
        socket.SendAsync(Encoding.UTF8.GetBytes(message), WebSocketMessageType.Text, true, token);

    private static async Task<JsonElement> Receive(WebSocket socket, CancellationToken token)
    {
        var buffer = new byte[8192];
        using var stream = new MemoryStream();
        WebSocketReceiveResult result;
        do
        {
            result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), token);
            stream.Write(buffer, 0, result.Count);
        } while (!result.EndOfMessage);
        return JsonSerializer.Deserialize<JsonElement>(stream.ToArray());
    }
}
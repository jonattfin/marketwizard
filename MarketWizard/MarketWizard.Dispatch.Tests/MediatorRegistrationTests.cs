using MarketWizard.Application;
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
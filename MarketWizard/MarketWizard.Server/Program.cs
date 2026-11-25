using MarketWizard.Application;
using MarketWizard.Infrastructure;
using MarketWizard.Server.Extensions;

var builder = WebApplication.CreateBuilder(args);

// Add service defaults & Aspire client integrations.
builder.AddServiceDefaults();

// Add services to the container.
builder.Services.AddProblemDetails();

builder.AddApplicationServices();
builder.AddInfrastructureServices();

// builder.Services.AddGraphQLServices();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseExceptionHandler();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

var api = app.MapGroup("/api");
api.MapRestEndpoints();

app.MapDefaultEndpoints();
// app.MapGraphQL();

app.UseFileServer();

app.Run();
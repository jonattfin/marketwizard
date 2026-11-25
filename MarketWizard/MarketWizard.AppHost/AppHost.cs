var builder = DistributedApplication.CreateBuilder(args);

var postgres = builder.AddPostgres("postgres")
    .WithPgAdmin()
    .WithPgWeb();
var marketWizardDb = postgres.AddDatabase("MarketWizard");

var marketWizardCache = builder.AddRedis("MarketWizardCache");

var server = builder.AddDotnetProject("server", "../MarketWizard.Server/MarketWizard.Server.csproj")
    .WithHttpHealthCheck("/health")
    .WithExternalHttpEndpoints()
    .WithReference(marketWizardDb)
    .WithReference(marketWizardCache);

server.AddEFMigrations("marketwizard-migrations", "MarketWizard.Infrastructure.Persistence.MarketWizardContext")
   .WithReference(marketWizardDb)
   .WaitFor(marketWizardDb)
   .RunDatabaseUpdateOnStart();

var webfrontend = builder.AddNextJsApp("webfrontend", "../frontend")
    .WithReference(server)
    .WaitFor(server);

server.PublishWithContainerFiles(webfrontend, "wwwroot");

builder.Build().Run();
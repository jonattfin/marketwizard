using MarketWizard.Infrastructure.Persistence.Entities;
using Microsoft.EntityFrameworkCore;

namespace MarketWizard.Infrastructure.Persistence;

public sealed class MarketWizardContext(DbContextOptions<MarketWizardContext> options) : DbContext(options)
{
    public DbSet<CronJob> CronJobs => Set<CronJob>();
}
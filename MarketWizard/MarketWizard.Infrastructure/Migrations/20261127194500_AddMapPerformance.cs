using MarketWizard.Infrastructure.Persistence;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MarketWizard.Infrastructure.Migrations;

[DbContext(typeof(MarketWizardContext))]
[Migration("20261127194500_AddMapPerformance")]
public partial class AddMapPerformance : Migration
{
    protected override void Up(MigrationBuilder migrationBuilder) =>
        migrationBuilder.Sql("ALTER TABLE \"CronJobs\" ADD COLUMN IF NOT EXISTS \"MapPerformance\" text NULL");

    protected override void Down(MigrationBuilder migrationBuilder) =>
        migrationBuilder.DropColumn(name: "MapPerformance", table: "CronJobs");
}
import { integer, pgTable, json, timestamp } from "drizzle-orm/pg-core";

export const cronJobsTable = pgTable("cron_jobs", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  indice_performance: json(),
  top_news: json(),
  sector_performance: json(),
  gainers: json(),
  losers: json(),
  top_industries: json(),
  worst_industries: json(),
  updated_at: timestamp()
});
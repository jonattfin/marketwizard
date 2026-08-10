import {IMiscRepository} from "@/app/database/interfaces/i-misc-repository";

import {drizzle,} from 'drizzle-orm/neon-http';
import {cronJobsTable} from "../../schema";

import {eq} from "drizzle-orm";
import {IndicePerformanceDataType, TopNewsDataType} from "@/shared/types";

export class UpdateMiscRepository {
  private readonly repository: IMiscRepository;

  constructor(repository: IMiscRepository) {
    this.repository = repository;
  }

  public async updateAll() {
    await Promise.all(
      [
        this.updateTopNews(),
        this.updateIndicesPerformance(),
        this.updateSectorPerformance(),
        this.updateWorstIndustries(),
        this.updateGainers(),
        this.updateLosers(),
        this.updateTopIndustries(),
      ]
    )
  }

  private async updateTopNews() {
    const news = await this.repository.fetchTopNews([]);
    await executeQuery("top_news", this.buildObject(news))
  }

  private async updateIndicesPerformance() {
    const indices = await this.repository.fetchIndicesPerformance();
    await executeQuery("indice_performance", this.buildObject(indices));
  }

  private async updateSectorPerformance() {
    const sectors = await this.repository.fetchSectorPerformance([]);

    await executeQuery("sector_performance", JSON.stringify(sectors));
  }

  private async updateWorstIndustries() {
    const worstIndustries = await this.repository.fetchWorstIndustries([], "");

    await executeQuery("worst_industries", this.buildObject(worstIndustries));
  }

  private async updateGainers() {
    const gainers = await this.repository.fetchGainers([], "");

    await executeQuery("gainers", this.buildObject(gainers));
  }

  private async updateLosers() {
    const losers = await this.repository.fetchLosers([], "");

    await executeQuery("losers", this.buildObject(losers));
  }

  private async updateTopIndustries() {
    const topIndustries = await this.repository.fetchTopIndustries([], "");

    await executeQuery("top_industries", this.buildObject(topIndustries));
  }

  private buildObject(data: unknown) {
    return JSON.stringify(data);
  }
}

const executeQuery = async (column: string, value: unknown) => {
  const db = drizzle(process.env.DATABASE_URL!);

  try {
    await db.update(cronJobsTable).set({[column]: value}).where(eq(cronJobsTable.id, 1));

    console.log("Updated " + column);

  } catch (e) {
    console.error("Failed to update table: " + column + ". Error: " + e);
  }
}
import { IMiscRepository } from "@/app/database/interfaces/i-misc-repository";
import {
  GainersDataType,
  IndicePerformanceDataType,
  LosersDataType,
  SectorPerformanceDataType,
  TopIndustriesDataType,
  TopNewsDataType,
  TreeMapType,
  WorstIndustriesDataType,
} from "@/shared/types";

import * as builder from "../builder";

import { drizzle } from "drizzle-orm/neon-http";
import { cronJobsTable } from "../../schema";
import { eq } from "drizzle-orm";

export class DbMiscRepository implements IMiscRepository {
  private readonly db = drizzle(process.env.DATABASE_URL!);

  async fetchIndicesPerformance(): Promise<IndicePerformanceDataType> {
    try {
      const response = await this.db
        .select({
          indice_performance: cronJobsTable.indice_performance,
        })
        .from(cronJobsTable)
        .where(eq(cronJobsTable.id, 1));

      return JSON.parse(
        response?.[0]?.indice_performance as string,
      ) as IndicePerformanceDataType;
    } catch (e) {
      console.error(e);
      return {
        items: [],
      };
    }
  }

  fetchMapPerformance(): Promise<TreeMapType[]> {
    return builder.buildMapPerformance();
  }

  async fetchSectorPerformance(
    countries: string[],
  ): Promise<SectorPerformanceDataType> {
    try {
      const response = await this.db
        .select({
          sector_performance: cronJobsTable.sector_performance,
        })
        .from(cronJobsTable)
        .where(eq(cronJobsTable.id, 1));
      return JSON.parse(
        response?.[0]?.sector_performance as string,
      ) as SectorPerformanceDataType;
    } catch (e) {
      console.error(e);
      return {
        items: [],
      };
    }
  }

  async fetchTopIndustries(
    countries: string[],
    period: string,
  ): Promise<TopIndustriesDataType> {
    try {
      const response = await this.db
        .select({
          top_industries: cronJobsTable.top_industries,
        })
        .from(cronJobsTable)
        .where(eq(cronJobsTable.id, 1));
      return JSON.parse(
        response?.[0]?.top_industries as string,
      ) as TopIndustriesDataType;
    } catch (e) {
      console.error(e);
      return {
        items: [],
      };
    }
  }

  async fetchTopNews(countries: string[]): Promise<TopNewsDataType> {
    try {
      const response = await this.db
        .select({
          top_news: cronJobsTable.top_news,
        })
        .from(cronJobsTable)
        .where(eq(cronJobsTable.id, 1));
      return JSON.parse(response?.[0]?.top_news as string) as TopNewsDataType;
    } catch (e) {
      console.error(e);
      return {
        items: [],
      };
    }
  }

  async fetchWorstIndustries(
    countries: string[],
    period: string,
  ): Promise<WorstIndustriesDataType> {
    try {
      const response = await this.db
        .select({
          worst_industries: cronJobsTable.worst_industries,
        })
        .from(cronJobsTable)
        .where(eq(cronJobsTable.id, 1));
      return JSON.parse(
        response?.[0]?.worst_industries as string,
      ) as WorstIndustriesDataType;
    } catch (e) {
      console.error(e);
      return {
        items: [],
      };
    }
  }

  async fetchGainers(
    countries: string[],
    period?: string,
  ): Promise<GainersDataType> {
    try {
      const response = await this.db
        .select({
          gainers: cronJobsTable.gainers,
        })
        .from(cronJobsTable)
        .where(eq(cronJobsTable.id, 1));
      return JSON.parse(response?.[0]?.gainers as string) as GainersDataType;
    } catch (e) {
      console.error(e);
      return {
        items: [],
      };
    }
  }

  async fetchLosers(
    countries: string[],
    period?: string,
  ): Promise<LosersDataType> {
    try {
      const response = await this.db
        .select({
          losers: cronJobsTable.losers,
        })
        .from(cronJobsTable)
        .where(eq(cronJobsTable.id, 1));
      return JSON.parse(response?.[0]?.losers as string) as LosersDataType;
    } catch (e) {
      console.error(e);
      return {
        items: [],
      };
    }
  }
}

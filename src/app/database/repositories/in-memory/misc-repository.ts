import {
  CountryType,
  EquityType,
  GainersDataType,
  IndicePerformanceDataType,
  LosersDataType,
  SectorPerformanceDataType,
  SectorType,
  TopIndustriesDataType,
  TopIndustriesType,
  TopNewsDataType,
  TreeMapType,
  WorstIndustriesDataType,
  WorstIndustriesType,
} from "@/shared/types";
import { orderBy, random, randomInt, range, take } from "es-toolkit";
import { LoremIpsum } from "lorem-ipsum";
import { IMiscRepository } from "@/app/database/interfaces/i-misc-repository";
import * as builder from "../builder";
import dayjs from "dayjs";

const lorem = new LoremIpsum();


export class MiscRepository implements IMiscRepository {
  private readonly etfs = createEtfs();

  async fetchTopNews(countries: string[]): Promise<TopNewsDataType> {
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const items = range(10).map((i) => {
      return {
        id: i,
        text: lorem.generateSentences(1),
        date: Date.now(),
        country,
        sentiment: Number.parseFloat(random(-1, 1).toPrecision(2)),
        source: "Reuters",
        description: lorem.generateSentences(2),
      };
    });

    return { items, date: dayjs().toDate() };
  }

  async fetchIndicesPerformance(): Promise<IndicePerformanceDataType> {
    const nextRandom = () => random(-0.05, 0.05);

    const values = [
      {
        id: 1,
        name: "S&P 500",
        regularMarketPrice: 6880,
        regularMarketChangePercent: nextRandom(),
        countryCode: "USA",
      },
      {
        id: 2,
        name: "Nikkei 225",
        regularMarketPrice: 43274,
        regularMarketChangePercent: nextRandom(),
        countryCode: "JPN",
      },
      {
        id: 3,
        name: "DAX",
        regularMarketPrice: 24189,
        regularMarketChangePercent: nextRandom(),
        countryCode: "DEU",
      },
      {
        id: 4,
        name: "FTSE 100",
        regularMarketPrice: 9165,
        regularMarketChangePercent: nextRandom(),
        countryCode: "GBR",
      },
      {
        id: 5,
        name: "Stoxx 50",
        regularMarketPrice: 5389,
        regularMarketChangePercent: nextRandom(),
        countryCode: "FRA",
      },
      {
        id: 6,
        name: "IBEX 35",
        regularMarketPrice: 15021,
        regularMarketChangePercent: nextRandom(),
        countryCode: "ESP",
      },

      {
        id: 7,
        name: "Shanghai Composite",
        regularMarketPrice: 3700,
        regularMarketChangePercent: nextRandom(),
        countryCode: "CHN",
      },
      {
        id: 8,
        name: "Sensex 30",
        regularMarketPrice: 67000,
        regularMarketChangePercent: nextRandom(),
        countryCode: "IND",
      },
      {
        id: 9,
        name: "ASX 200",
        regularMarketPrice: 7150,
        regularMarketChangePercent: nextRandom(),
        countryCode: "AUS",
      },
      {
        id: 10,
        name: "KOSPI",
        regularMarketPrice: 2760,
        regularMarketChangePercent: nextRandom(),
        countryCode: "KOR",
      },
    ];

    return {
      items: values,
      date: dayjs().toDate(),
    };
  }

  async fetchSectorPerformance(
    countries: string[],
  ): Promise<SectorPerformanceDataType> {
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const values = Object.values(SectorType).map((type) => ({
      type,
      change: random(-0.05, 0.05),
      country: country,
    }));

    return {
      items: values,
      date: dayjs().toDate(),
    };
  }

  async fetchWorldEquity(): Promise<EquityType[]> {
    return Object.values(CountryType).map((type) => {
      return {
        country: type,
        change: random(-0.3, 0.3),
        lastPrice: random(1, 100),
        volume: random(100, 1000),
      };
    });
  }

  fetchMapPerformance(): Promise<TreeMapType[]> {
    return builder.buildMapPerformance();
  }

  async fetchTopIndustries(
    countries: string[],
    period: string,
  ): Promise<TopIndustriesDataType> {
    const p = Number.parseInt(period || "1");
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const values: TopIndustriesType[] = Object.values(SectorType).map(
      (type) => {
        return {
          type,
          country,
          change: random(-0.05, 0.05),
        };
      },
    );

    return {
      items: take(orderBy(values, ["change"], ["asc"]), 5),
      date: dayjs().toDate(),
    };
  }

  async fetchWorstIndustries(
    countries: string[],
    period: string,
  ): Promise<WorstIndustriesDataType> {
    const p = Number.parseInt(period || "1");
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const values: WorstIndustriesType[] = Object.values(SectorType).map(
      (sector) => {
        return {
          type: sector,
          country,
          change: random(-0.05, 0.05),
        };
      },
    );

    return {
      items: take(orderBy(values, ["change"], ["asc"]), 5),
      date: dayjs().toDate(),
    };
  }

  async fetchGainers(
    countries: string[],
    period?: string,
  ): Promise<GainersDataType> {
    const p = Number.parseInt(period || "1");
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const buildGainers = () => {
      const nextRandom = (min: number = -0.1, max: number = 0.2) =>
        random(min, max);

      const values = Object.values(SectorType).map((type) => {
        return {
          type,
          change: nextRandom(),
          country,
        };
      });

      return take(orderBy(values, ["change"], ["desc"]), 5);
    };

    return {
      items: buildGainers(),
      date: dayjs().toDate(),
    };
  }

  async fetchLosers(
    countries: string[],
    period?: string,
  ): Promise<LosersDataType> {
    const p = Number.parseInt(period || "1");
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const buildLosers = () => {
      const nextRandom = (min: number = -0.5, max: number = 0.2) =>
        random(min, max);

      const values = Object.values(SectorType).map((type) => {
        return {
          type,
          country,
          change: nextRandom(),
        };
      });

      return take(orderBy(values, ["change"], ["asc"]), 5);
    };

    return {
      items: buildLosers(),
      date: dayjs().toDate(),
    };
  }
}

function createEtfs() {
  return [
    { id: "1", name: "ETF A" },
    { id: "2", name: "ETF B" },
    { id: "3", name: "ETF C" },
    { id: "4", name: "ETF D" },
    { id: "5", name: "ETF E" },
  ];
}

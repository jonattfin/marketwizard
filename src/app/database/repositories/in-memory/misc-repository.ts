import {
  CountryType,
  EquityType, GainersDataType, IndicePerformanceDataType,
  LosersDataType, SectorPerformanceDataType,
  SectorType, TopIndustriesDataType, TopIndustriesType, TopNewsDataType,
  TreeMapType, WorstIndustriesDataType, WorstIndustriesType
} from "@/shared/types";
import {orderBy, random, randomInt, range, take} from "es-toolkit";
import {LoremIpsum} from "lorem-ipsum";
import {IMiscRepository} from "@/app/database/repositories/interfaces/i-misc-repository";
import * as builder from "../builder";
import dayjs from "dayjs";

const lorem = new LoremIpsum();

export class MiscRepository implements IMiscRepository {
  private readonly etfs = createEtfs();

  fetchTopNews(countries: string[]): Promise<TopNewsDataType> {
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
        description: lorem.generateSentences(2)
      }
    })

    return Promise.resolve({items, date: dayjs().toDate()});
  }

  fetchIndicesPerformance(): Promise<IndicePerformanceDataType> {
    const values = [
      {id: 1, name: "S&P 500", ytdPerformance: 0.12, points: 6880, countryCode: "USA"},
      {id: 2, name: "Nikkei 225", ytdPerformance: 0.14, points: 43274, countryCode: "JPN"},
      {id: 3, name: "DAX", ytdPerformance: 0.08, points: 24189, countryCode: "DEU"},
      {id: 4, name: "FTSE 100", ytdPerformance: 0.07, points: 9165, countryCode: "GBR"},
      {id: 5, name: "Stoxx 50", ytdPerformance: 0.06, points: 5389, countryCode: "FRA"},
      {id: 6, name: "IBEX 35", ytdPerformance: 0.05, points: 15021, countryCode: "ESP"},

      {id: 7, name: "Shanghai Composite", ytdPerformance: 0.03, points: 3700, countryCode: "CHN"},
      {id: 8, name: "Sensex 30", ytdPerformance: 0.15, points: 67000, countryCode: "IND"},
      {id: 9, name: "ASX 200", ytdPerformance: 0.05, points: 7150, countryCode: "AUS"},
      {id: 10, name: "KOSPI", ytdPerformance: 0.06, points: 2760, countryCode: "KOR"},
    ];

    return Promise.resolve({
      items: values,
      date: dayjs().toDate()
    });
  }

  fetchSectorPerformance(countries: string[]): Promise<SectorPerformanceDataType> {
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const values = Object.values(SectorType).map(type => ({
      type,
      change: random(-0.1, 0.1),
      country: country
    }));

    return Promise.resolve({
      items: values,
      date: dayjs().toDate()
    });
  }

  fetchWorldEquity(): Promise<EquityType[]> {
    const values = Object.values(CountryType).map(type => {
      return {
        country: type,
        change: random(-0.3, 0.3),
        lastPrice: random(1, 100),
        volume: random(100, 1000)
      };
    });

    return Promise.resolve(values);
  }

  fetchMapPerformance(): Promise<TreeMapType[]> {
    return builder.buildMapPerformance();
  }


  fetchTopIndustries(countries: string[], period: string): Promise<TopIndustriesDataType> {
    const p = Number.parseInt(period || "1");
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const values: TopIndustriesType[] = Object.values(SectorType).map((type) => {
      return {
        type,
        country,
        change: p * random(0.5, 0.9)
      }
    });

    return Promise.resolve({
      items: take(orderBy(values, ['change'], ['asc']), 5),
      date: dayjs().toDate()
    });
  }

  fetchWorstIndustries(countries: string[], period: string): Promise<WorstIndustriesDataType> {
    const p = Number.parseInt(period || "1");
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const values: WorstIndustriesType[] = Object.values(SectorType).map((sector) => {
      return {
        type: sector,
        country,
        change: p * random(-0.5, -0.1)
      }
    });

    return Promise.resolve({
      items: take(orderBy(values, ['change'], ['asc']), 5),
      date: dayjs().toDate()
    });
  }

  fetchGainers(countries: string[], period?: string): Promise<GainersDataType> {
    const p = Number.parseInt(period || "1");
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const buildGainers = () => {
      const nextRandom = (min: number = 0.1, max: number = 0.5) => random(min, max) * p;

      const values = Object.values(SectorType).map((type) => {
        return {
          type,
          change: nextRandom(),
          country
        }
      })

      return take(orderBy(values, ['change'], ['desc']), 5);
    }

    return Promise.resolve({
      items: buildGainers(),
      date: dayjs().toDate()
    })
  }

  fetchLosers(countries: string[], period?: string): Promise<LosersDataType> {
    const p = Number.parseInt(period || "1");
    let country = "N/A";
    if (countries.length > 0) {
      country = countries[randomInt(0, countries.length)];
    }

    const buildLosers = () => {
      const nextRandom = (min: number = -0.5, max: number = -0.1) => random(min, max) * p;

      const values = Object.values(SectorType).map((type) => {
        return {
          type,
          country,
          change: nextRandom(),
        }
      })

      return take(orderBy(values, ['change'], ['asc']), 5)
    }

    return Promise.resolve({
      items: buildLosers(),
      date: dayjs().toDate()
    })
  }

}

function createEtfs() {
  return [
    {id: "1", name: "ETF A"},
    {id: "2", name: "ETF B"},
    {id: "3", name: "ETF C"},
    {id: "4", name: "ETF D"},
    {id: "5", name: "ETF E"},
  ]
}
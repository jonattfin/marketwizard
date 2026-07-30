import {IMiscRepository} from "@/app/database/repositories/interfaces/i-misc-repository";
import {
  GainersDataType, IndicePerformanceDataType,
  LosersDataType, SectorPerformanceDataType,
  TopIndustriesDataType,
  TopNewsDataType,
  TreeMapType, WorstIndustriesDataType
} from "@/shared/types";
import {take} from "es-toolkit";
import dayjs from "dayjs";

export class MiscRepository implements IMiscRepository {
  async fetchGainers(countries: string[], period?: string): Promise<GainersDataType> {
    return {
      items: [],
      date: new Date(),
    };
  }

  async fetchIndicesPerformance(): Promise<IndicePerformanceDataType> {
    const indices = [
      {countryCode: "USA", ticker: "^SPX", name: "S&P 500"},
      {countryCode: "JPN", ticker: "^N225", name: "Nikkei 225"},
      {countryCode: "DEU", ticker: "^GDAXI", name: "DAX"},
      {countryCode: "GBR", ticker: "^FTSE", name: "FTSE 100"},
      {countryCode: "FRA", ticker: "^STOXX50E", name: "Stoxx 50"},
      {countryCode: "ESP", ticker: "^IBEX", name: "IBEX 35"},
      {countryCode: "CHN", ticker: "^SSEC", name: "Sensex 30"},
      {countryCode: "AUS", ticker: "^BSESN", name: "ASX 200"},
      {countryCode: "KOR", ticker: "^AXJO", name: "KOSPI"}
    ]

    const url = getYahooFinanceUrl(`v1/markets/stock/quotes?ticker=${indices.map(i => i.ticker).join()}`);
    const data = await fetchTyped<YahooFinanceQuote>(url);

    if (!data) {
      return {
        items: []
      };
    }

    return {
      items: data?.body?.map((item, i) => ({
        id: i,
        name: indices[i]?.name,
        ytdPerformance: 0,
        points: item.regularMarketPreviousClose,
        countryCode: indices[i]?.countryCode
      })),
      date: dayjs().toDate()
    }
  }

  async fetchLosers(countries: string[], period?: string): Promise<LosersDataType> {
    return {
      items: [],
      date: dayjs().toDate()
    };
  }

  async fetchMapPerformance(): Promise<TreeMapType[]> {
    return [];
  }

  async fetchSectorPerformance(countries: string[]): Promise<SectorPerformanceDataType> {
    return {
        items: [],
        date: new Date()
      };
  }

  async fetchTopNews(countries: string[]): Promise<TopNewsDataType> {
    const url = getYahooFinanceUrl("v1/markets/news");
    const data = await fetchTyped<YahooFinanceNews>(url);

    console.log("top news", data)

    if (!data) {
      return {
        items: []
      };
    }

    return {
      items: take(data?.body || [], 10).map((item, i) => ({
        id: i,
        text: item.title,
        source: item.source,
        date: Date.now(),
        sentiment: 0,
        country: "N/A",
        description: item.text
      })),
      date: dayjs().toDate()
    }
  }

  async fetchTopIndustries(countries: string[], period: string): Promise<TopIndustriesDataType> {
    return {
      items: [],
      date: dayjs().toDate()
    };
  }


  async fetchWorstIndustries(countries: string[], period: string): Promise<WorstIndustriesDataType> {
    return {
      items: [],
      date: dayjs().toDate()
    };
  }

}

const getYahooFinanceUrl = (functionality: string): string => {
  return getRapidApiUrl("yahoo-finance15", functionality);
}

const getRapidApiUrl = (provider: string, functionality: string): string => {
  return `https://${provider}.p.rapidapi.com/api/${functionality}`
}

async function fetchTyped<T>(url: string): Promise<T | undefined> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        "x-rapidapi-key": process.env.RAPID_API_KEY ?? "",
      }
    });
    return await response.json() as Promise<T>;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

type YahooFinanceNews = {
  body: {
    title: string;
    link: string;
    source: string;
    ago: string;
    text: string;
  }[]
}

type YahooFinanceQuote = {
  body: {
    shortName: string;
    regularMarketPreviousClose: number;
  }[]
}

import {LazyPortfolioType, PortfolioPerformanceType, PortfoliosAreaType, PortfolioType} from "@/shared/types";

import {random} from "es-toolkit";
import {LoremIpsum} from "lorem-ipsum";
import {IPortfolioRepository} from "@/app/database/repositories/interfaces/i-portfolio-repository";

const lorem = new LoremIpsum();

export class PortfolioRepository implements IPortfolioRepository {
  private readonly portfolios = createPortfolios();
  private readonly lazyPortfolios = createLazyPortfolios();

  async fetchLazyPortfolioById(id: number): Promise<LazyPortfolioType | undefined> {
    return this.lazyPortfolios.find(p => p.id === id);
  }

  async fetchLazyPortfolios(pageNumber: number = 1, pageSize: number = 5): Promise<[number, LazyPortfolioType[]]> {
    const values = this.lazyPortfolios;

    return [
      values.length,
      values.slice((pageNumber - 1) * pageSize, pageNumber * pageSize)
    ];
  }

  async fetchPortfoliosPerformance(): Promise<PortfolioPerformanceType[]> {
    return this.portfolios.map(p => {
      return {
        id: p.id,
        portfolioName: p.name,
        "7d": random(0, 1),
        "1y": random(-1, 1)
      }
    })
  }

  async fetchPortfolioById(id: string): Promise<PortfolioType | undefined> {
    return this.portfolios.find((p) => p.id === id)
  }

  async fetchPortfolios(): Promise<PortfolioType[]> {
    return this.portfolios.map(({name, id}) => ({
      id,
      name: name,
      description: lorem.generateSentences(2),
      totalValue: random(100, 1000),
      unrealizedGain: random(100, 300),
      createdAt: new Date(),
      holdings: 3,
      assets: []
    }));
  }

  async fetchPortfoliosArea(portfolioId?: string): Promise<PortfoliosAreaType> {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    let filteredPortfolios = this.portfolios;
    if (portfolioId) {
      filteredPortfolios = this.portfolios.filter((portfolio) => portfolio.id === portfolioId);
    }

    const performance = months.map((month) => {
      return {
        month: month,
        portfolios: filteredPortfolios.map(p => {
          return {
            name: p.name,
            performance: random(-5, 10).toFixed(2)
          }
        })
      }
    })

    return {
      portfolios: filteredPortfolios.map(p => p.name),
      performance
    };
  }
}

function createPortfolios() {
  return [
    {id: "1", name: "Growth"},
    {id: "2", name: "Energetic"},
    {id: "3", name: "Smooth"},
    {id: "4", name: "Calm"},
    {id: "5", name: "Protective"},
  ]
}

function createLazyPortfolios(): LazyPortfolioType[] {
  return [
    {
      id: 1,
      name: "Ray Dalio All Weather Portfolio",
      description: "The Ray Dalio All Weather Portfolio can be implemented with 5 ETFs. This portfolio has a medium risk, signifying moderate fluctuations in value. It is suitable for investors with a balanced approach to risk and return, seeking steady growth while tolerating some level of volatility.",
      "1d": 0.1,
      ytd: 0.3,
      maxDrawdown: 1,
      sharpeRatio: 1,
      performanceRank: 1,
      expenseRatio: 1,
      dividendYield: 2,
      items: [
        {
          id: 11,
          name: "Vanguard Total Stock Market",
          weight: 30,
          ticker: "VTI",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 12,
          name: "iShares 20+ Year Treasury Bond",
          weight: 40,
          ticker: "TLT",
          themes: "Bond US, Long Term",
          type: "f",
        },
        {
          id: 13,
          name: "iShares 3-7 Year Treasury Bond",
          weight: 15,
          ticker: "IEI",
          themes: "Equity US, Intermediate Term",
          type: "f",
        },
        {
          id: 14,
          name: "Invesco DB Commodity Tracking",
          weight: 7.5,
          ticker: "DBC",
          themes: "Commodity, Broad Diversified",
          type: "c",
        },
        {
          id: 15,
          name: "SDPR Gold Trust",
          weight: 7.5,
          ticker: "GLD",
          themes: "Commodity, Gold",
          type: "c",
        }
      ]
    },
    {
      id: 2,
      name: "Warren Buffett Portfolio",
      description: "The Warren Buffett Portfolio can be implemented with 2 ETFs. This portfolio has a very high risk, meaning it can experience significant fluctuations in value. It is suitable for investors with a high risk tolerance who are seeking substantial returns and can withstand large drawdowns.",
      "1d": 0.01,
      ytd: 0.3,
      maxDrawdown: 1,
      sharpeRatio: 1,
      performanceRank: 1,
      expenseRatio: 1,
      dividendYield: 3,
      items: [
        {
          id: 21,
          name: "Vanguard Large Cap ETF",
          weight: 90,
          ticker: "VV",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 22,
          name: "Bond, US, Short Term",
          weight: 10,
          ticker: "SHY",
          themes: "Bond US, Long Term",
          type: "f",
        }
      ]
    },
    {
      id: 3,
      name: "Tyler Golden Butterfly Portfolio",
      description: "The Tyler Golden Butterfly Portfolio can be implemented with 5 ETFs. This portfolio has a high risk, indicating it can undergo considerable value changes. It is appropriate for investors with a high risk tolerance who are aiming for higher returns and can handle notable drawdowns.",
      "1d": 0.02,
      ytd: 0.3,
      maxDrawdown: 1,
      sharpeRatio: 1,
      performanceRank: 1,
      expenseRatio: 1,
      dividendYield: 1,
      items: [
        {
          id: 31,
          name: "Equity, U.S., Small Cap, Value (USD)",
          weight: 30,
          ticker: "IJS",
          themes: "iShares S&P Small Cap ETF",
          type: "s",
        },
        {
          id: 32,
          name: "Vanguard Total Stock Market",
          weight: 20,
          ticker: "VTI",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 33,
          name: "iShares 3-7 Year Treasury Bond",
          weight: 20,
          ticker: "SHY",
          themes: "Bond US, Short Term",
          type: "f",
        },
        {
          id: 34,
          name: "IShares 20+ Year Treasury Bond",
          weight: 20,
          ticker: "TLT",
          themes: "Bond, US, Long Term",
          type: "f",
        },
        {
          id: 35,
          name: "SDPR Gold Trust",
          weight: 20,
          ticker: "GLD",
          themes: "Commodity, Gold",
          type: "c",
        }
      ]
    },
    {
      id: 4,
      name: "Bogleheads Three Funds Portfolio",
      description: "Bogleheads Three Funds Portfolio",
      "1d": 0.01,
      ytd: 0.1,
      maxDrawdown: 1,
      sharpeRatio: 1,
      performanceRank: 1,
      expenseRatio: 1,
      dividendYield: 1,
      items: [
        {
          id: 41,
          name: "Vanguard Total Stock Market",
          weight: 50,
          ticker: "VTI",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 42,
          name: "Vanguard Total Stock Market",
          weight: 30,
          ticker: "VEU",
          themes: "Bond US, Long Term",
          type: "f",
        },
        {
          id: 43,
          name: "Vanguard Total Bond Market",
          weight: 20,
          ticker: "BND",
          themes: "Bond US, Long Term",
          type: "f",
        }
      ]
    },
    {
      id: 5,
      name: "Cathie Wood Ark Tech Portfolio",
      description: "The Cathie Wood Ark Tech Portfolio can be implemented with 4 ETFs. This portfolio has a very high risk, meaning it can experience significant fluctuations in value. It is suitable for investors with a high risk tolerance who are seeking substantial returns and can withstand large drawdowns.",
      "1d": -0.01,
      ytd: 0.2,
      maxDrawdown: 1,
      sharpeRatio: 1,
      performanceRank: 1,
      expenseRatio: 1,
      dividendYield: 1,
      items: [
        {
          id: 51,
          name: "ARK Genomic Revolution ETF",
          weight: 25,
          ticker: "ARKG",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 52,
          name: "ARK Innovation ETF",
          weight: 25,
          ticker: "ARKK",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 53,
          name: "ARK Autonomous Tech ETF",
          weight: 25,
          ticker: "ARKQ",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 54,
          name: "ARK Next Gen Internet ETF",
          weight: 25,
          ticker: "ARKW",
          themes: "Equity US, Large Cap",
          type: "s",
        },
      ]
    },
    {
      id: 6,
      name: "Davide Pisicchio Diavola Portfolio",
      description: "The Davide Pisicchio Diavola Portfolio can be implemented with 4 ETFs. This portfolio has a very high risk, meaning it can experience significant fluctuations in value. It is suitable for investors with a high risk tolerance who are seeking substantial returns and can withstand large drawdowns.",
      "1d": 0.2,
      ytd: -0.3,
      maxDrawdown: 1,
      sharpeRatio: 1,
      performanceRank: 1,
      expenseRatio: 1,
      dividendYield: 1,
      items: [
        {
          id: 61,
          name: "Vanguard Total Stock Market",
          weight: 65,
          ticker: "VTI",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 62,
          name: "Invesco QQQ Trust",
          weight: 25,
          ticker: "QQQ",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 63,
          name: "Vanguard Short Term Bond Market",
          weight: 5,
          ticker: "BSV",
          themes: "Equity US, Large Cap",
          type: "f",
        },
        {
          id: 64,
          name: "iShares 3-7 Year Treasury Bond",
          weight: 5,
          ticker: "ARKW",
          themes: "Bond US, Short Term",
          type: "s",
        },
      ]
    },
    {
      id: 7,
      name: "Developed World ex-US 20/80 Portfolio",
      description: "The Developed World ex-US 20/80 Portfolio can be implemented with 2 ETFs. This portfolio has a low risk, suggesting it experiences minor value changes. It is ideal for conservative investors who prioritize capital preservation and prefer stable, predictable returns.",
      "1d": 0.1,
      ytd: 0.4,
      maxDrawdown: 1,
      sharpeRatio: 1,
      performanceRank: 1,
      expenseRatio: 1,
      dividendYield: 1,
      items: [
        {
          id: 71,
          name: "Vanguard FTSE Developed Markets",
          weight: 20,
          ticker: "VEA",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 72,
          name: "Vanguard Total International Bond",
          weight: 80,
          ticker: "BNDX",
          themes: "Equity US, Large Cap",
          type: "f",
        },
      ]
    },
    {
      id: 8,
      name: "Scott Burns Couch Potato Portfolio",
      description: "The Scott Burns Couch Potato Portfolio can be implemented with 2 ETFs. This portfolio has a medium risk, signifying moderate fluctuations in value. It is suitable for investors with a balanced approach to risk and return, seeking steady growth while tolerating some level of volatility.",
      "1d": 0.01,
      ytd: 0.1,
      maxDrawdown: 1,
      sharpeRatio: 1,
      performanceRank: 1,
      expenseRatio: 1,
      dividendYield: 3,
      items: [
        {
          id: 81,
          name: "Vanguard Total Stock Market",
          weight: 50,
          ticker: "VTI",
          themes: "Equity US, Large Cap",
          type: "s",
        },
        {
          id: 82,
          name: "iShared TIPS Bond",
          weight: 50,
          ticker: "TIP",
          themes: "Bond US, Long Term",
          type: "f",
        }
      ]
    },
  ];
}
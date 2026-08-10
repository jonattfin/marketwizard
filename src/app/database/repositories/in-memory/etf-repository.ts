import {EtfThemeByIdType, EtfThemeType} from "@/shared/types";
import {LoremIpsum} from "lorem-ipsum";
import {IEtfRepository} from "@/app/database/interfaces/i-etf-repository";

const lorem = new LoremIpsum();

export class EtfRepository implements IEtfRepository {
  private readonly etfThemes = createEtfThemes();

  async fetchEtfById(id: string): Promise<EtfThemeByIdType | undefined> {
    const theme = this.etfThemes.find(t => t.theme === id);

    return createEtfByIdType(theme?.name, theme?.imageUrl, theme?.description);
  }

  async fetchEtfs(): Promise<EtfThemeType[]> {
    return this.etfThemes;
  }
}

function createEtfThemes(): EtfThemeType[] {
  return [
    {
      id: 1,
      name: "S&P 500 ETFs",
      description: lorem.generateParagraphs(3),
      theme: "SP500-ETFs",
      imageUrl: "https://plus.unsplash.com/premium_photo-1663931932687-c4c2366a5c61?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 2,
      name: "Nasdaq 100 ETFs",
      description: lorem.generateParagraphs(3),
      theme: "Nasdaq-100-ETFs",
      imageUrl: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 3,
      name: "MSCI World ETFs",
      description: lorem.generateParagraphs(3),
      theme: "MSCI-World-ETFs",
      imageUrl: "https://plus.unsplash.com/premium_photo-1681487769650-a0c3fbaed85a?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 4,
      name: "Defense ETFs",
      description: "The military and defense industry is a controversial topic. " +
        "But even though stocks from the armaments sector are a no-go investment for many for understandable moral reasons, the industry flourishes especially in troubled times. " +
        "This is because the customers of the arms companies are almost exclusively states, which usually have large budgets. " +
        "In addition, the technologies of the aerospace, military and defense companies are often also used in civil aviation and space travel after their introduction.",
      theme: "Defense-ETFs",
      imageUrl: "https://images.unsplash.com/photo-1489223339793-de491ea9108b?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
    {
      id: 5,
      name: "Artificial Intelligence ETFs",
      description: "Artificial Intelligence is an area of computer science that focuses the creation of intelligent machines that work and react like humans. Artificial Intelligence ETFs potentially stand to benefit from increased adoption and utilization of artificial intelligence, including those involved with industrial and non-industrial robotics, automation, 3D printing, natural language processing, social media, and autonomous vehicles.",
      theme: "AI-ETFs",
      imageUrl: "https://images.unsplash.com/photo-1612010167108-3e6b327405f0?q=80&w=640&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    },
  ]
}

const createEtfByIdType = (name?: string, imageUrl?: string, description?: string): EtfThemeByIdType => {
  const items = [
    {
      isin: 1,
      name: "VanEck Defense UCITS Etf",
      fundSize: 6118,
      ter: 0.99,
      useOfProfits: "Accumulating",
      fundDomicile: "Ireland",
      replicationMethod: "Full replication"
    },
    {
      isin: 2,
      name: "WisdomTree Europe Defense UCITS",
      fundSize: 3099,
      ter: 0.99,
      useOfProfits: "Accumulating",
      fundDomicile: "Ireland",
      replicationMethod: "Full replication"
    },
    {
      isin: 3,
      name: "iShares Global Aerospace",
      fundSize: 2471,
      ter: 0.99,
      useOfProfits: "Accumulating",
      fundDomicile: "Ireland",
      replicationMethod: "Full replication"
    },
  ]

  return {
    name,
    imageUrl,
    description,
    items
  }
}
import { ApolloClient, gql, HttpLink, InMemoryCache } from "@apollo/client";
import {
  type EtfThemeByIdType,
  type EtfThemeType,
  type IndicePerformanceDataType,
  type LazyPortfolioType,
  type SectorPerformanceDataType,
  SectorType,
  type TopNewsDataType,
  type TreeMapType,
} from "./types";

// TanStack Query owns the UI cache; avoid sharing Apollo's cache across server renders.
const client = new ApolloClient({
  link: new HttpLink({ uri: "/graphql" }),
  cache: new InMemoryCache(),
  defaultOptions: { query: { fetchPolicy: "no-cache" } },
});

async function query<T>(
  document: ReturnType<typeof gql>,
  variables?: Record<string, unknown>,
): Promise<T> {
  const result = await client.query<T>({ query: document, variables });
  if (!result.data) throw new Error("GraphQL response contained no data");
  return result.data;
}

const indicesQuery = gql`query Indices { indices { date items { id name countryCode regularMarketChangePercent regularMarketPrice } } }`;
const newsQuery = gql`query TopNews($countries: [String!]!) { topNews(countries: $countries) { date items { id text date sentiment country source description url } } }`;
const gainersQuery = gql`query TopGainers($countries: [String!]!, $period: String!) { topGainers(countries: $countries, period: $period) { date items { type change country } } }`;
const losersQuery = gql`query TopLosers($countries: [String!]!, $period: String!) { topLosers(countries: $countries, period: $period) { date items { type change country } } }`;
const industriesQuery = gql`query TopIndustries($countries: [String!]!, $period: String!) { topIndustries(countries: $countries, period: $period) { date items { type change country } } }`;
const worstIndustriesQuery = gql`query WorstIndustries($countries: [String!]!, $period: String!) { worstIndustries(countries: $countries, period: $period) { date items { type change country } } }`;
const sectorQuery = gql`query SectorPerformance($countries: [String!]!) { sectorPerformance(countries: $countries) { date items { type change country } } }`;
const mapQuery = gql`query MapPerformance { mapPerformance { sector companies { company change } } }`;
const portfoliosQuery = gql`query LazyPortfolios { lazyPortfolios { numberOfLazyPortfolios items { id name description oneDay ytd dividendYield performanceRank maxDrawdown expenseRatio sharpeRatio items { id weight ticker name themes type } } } }`;
const portfolioQuery = gql`query LazyPortfolioById($id: Int!) { lazyPortfolioById(id: $id) { id name description oneDay ytd dividendYield performanceRank maxDrawdown expenseRatio sharpeRatio items { id weight ticker name themes type } } }`;
const etfsQuery = gql`query Etfs { etfs { id name theme description imageUrl } }`;
const etfQuery = gql`query EtfById($id: String!) { etfById(id: $id) { name imageUrl description items { isin name fundSize ter useOfProfits fundDomicile replicationMethod } } }`;

const sectors: Record<string, SectorType> = {
  BASIC_MATERIALS: SectorType.BasicMaterials,
  TELECOM: SectorType.Telecom,
  CONSUMER_GOODS: SectorType.ConsumerGoods,
  CUSTOMER_STAPLES: SectorType.CustomerStaples,
  CONSUMER_SERVICES: SectorType.ConsumerServices,
  ENERGY: SectorType.Energy,
  FINANCIALS: SectorType.Financials,
  HEALTH_CARE: SectorType.HealthCare,
  INDUSTRIALS: SectorType.Industrials,
  MATERIALS: SectorType.Materials,
  UTILITIES: SectorType.Utilities,
  TECHNOLOGY: SectorType.Technology,
};

function normalizeSectors(
  data: SectorPerformanceDataType,
): SectorPerformanceDataType {
  return {
    ...data,
    items: data.items.map((item) => ({
      ...item,
      type: sectors[item.type] ?? item.type,
    })),
  };
}

type GraphPortfolio = Omit<LazyPortfolioType, "1d" | "items"> & {
  oneDay: number;
  items: (Omit<LazyPortfolioType["items"][number], "type"> & {
    type: string;
  })[];
};
function normalizePortfolio(portfolio: GraphPortfolio): LazyPortfolioType {
  return {
    ...portfolio,
    "1d": portfolio.oneDay,
    items: portfolio.items.map((item) => ({
      ...item,
      type: item.type.toLowerCase() as "s" | "c" | "f",
    })),
  };
}

export async function getIndices() {
  return (await query<{ indices: IndicePerformanceDataType }>(indicesQuery))
    .indices;
}
export async function getTopNews(countries: string[]) {
  return (await query<{ topNews: TopNewsDataType }>(newsQuery, { countries }))
    .topNews;
}
export async function getTopGainers(countries: string[], period: string) {
  return normalizeSectors(
    (
      await query<{ topGainers: SectorPerformanceDataType }>(gainersQuery, {
        countries,
        period,
      })
    ).topGainers,
  );
}
export async function getTopLosers(countries: string[], period: string) {
  return normalizeSectors(
    (
      await query<{ topLosers: SectorPerformanceDataType }>(losersQuery, {
        countries,
        period,
      })
    ).topLosers,
  );
}
export async function getTopIndustries(countries: string[], period: string) {
  return normalizeSectors(
    (
      await query<{ topIndustries: SectorPerformanceDataType }>(
        industriesQuery,
        { countries, period },
      )
    ).topIndustries,
  );
}
export async function getWorstIndustries(countries: string[], period: string) {
  return normalizeSectors(
    (
      await query<{ worstIndustries: SectorPerformanceDataType }>(
        worstIndustriesQuery,
        { countries, period },
      )
    ).worstIndustries,
  );
}
export async function getSectorPerformance(countries: string[]) {
  return normalizeSectors(
    (
      await query<{ sectorPerformance: SectorPerformanceDataType }>(
        sectorQuery,
        { countries },
      )
    ).sectorPerformance,
  );
}
export async function getMapPerformance() {
  const data = (await query<{ mapPerformance: TreeMapType[] }>(mapQuery))
    .mapPerformance;
  return data.map((item) => ({
    ...item,
    sector: sectors[item.sector] ?? item.sector,
  }));
}
export async function getLazyPortfolios() {
  const data = (
    await query<{
      lazyPortfolios: {
        numberOfLazyPortfolios: number;
        items: GraphPortfolio[];
      };
    }>(portfoliosQuery)
  ).lazyPortfolios;
  return { ...data, items: data.items.map(normalizePortfolio) };
}
export async function getLazyPortfolioById(id: number) {
  const data = (
    await query<{ lazyPortfolioById: GraphPortfolio | null }>(portfolioQuery, {
      id,
    })
  ).lazyPortfolioById;
  return data ? normalizePortfolio(data) : null;
}
export async function getEtfs() {
  return (await query<{ etfs: EtfThemeType[] }>(etfsQuery)).etfs;
}
export async function getEtfById(id: string) {
  return (await query<{ etfById: EtfThemeByIdType | null }>(etfQuery, { id }))
    .etfById;
}

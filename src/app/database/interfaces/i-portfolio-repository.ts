import {
  LazyPortfolioType,
  PortfolioPerformanceType,
  PortfoliosAreaType,
  PortfolioType,
} from "@/shared/types";

export interface IPortfolioRepository {
  fetchLazyPortfolios(
    pageNumber: number,
    pageSize: number,
  ): Promise<[number, LazyPortfolioType[]]>;

  fetchLazyPortfolioById(id: number): Promise<LazyPortfolioType | undefined>;

  fetchPortfolios(): Promise<PortfolioType[]>;

  fetchPortfolioById(id: string): Promise<PortfolioType | undefined>;

  fetchPortfoliosArea(portfolioId?: string): Promise<PortfoliosAreaType>;

  fetchPortfoliosPerformance(): Promise<PortfolioPerformanceType[]>;
}

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

export interface IMiscRepository {
  fetchTopNews(countries: string[]): Promise<TopNewsDataType>;

  fetchIndicesPerformance(): Promise<IndicePerformanceDataType>;

  fetchSectorPerformance(
    countries: string[],
  ): Promise<SectorPerformanceDataType>;

  fetchMapPerformance(): Promise<TreeMapType[]>;

  fetchWorstIndustries(
    countries: string[],
    period: string,
  ): Promise<WorstIndustriesDataType>;

  fetchTopIndustries(
    countries: string[],
    period: string,
  ): Promise<TopIndustriesDataType>;

  fetchGainers(countries: string[], period?: string): Promise<GainersDataType>;

  fetchLosers(countries: string[], period?: string): Promise<LosersDataType>;
}

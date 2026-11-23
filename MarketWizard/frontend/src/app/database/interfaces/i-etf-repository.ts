import { EtfThemeByIdType, EtfThemeType } from "@/shared/types";

export interface IEtfRepository {
  fetchEtfs(): Promise<EtfThemeType[]>;

  fetchEtfById(id: string): Promise<EtfThemeByIdType | undefined>;
}

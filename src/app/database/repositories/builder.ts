import { SectorType } from "@/shared/types";
import { range, random } from "es-toolkit";
import { LoremIpsum } from "lorem-ipsum";

const lorem = new LoremIpsum();

export const buildMapPerformance = () => {
  const values = Object.values(SectorType).map((type) => ({
    sector: type,
    companies: range(1, 5).map(() => ({
      company: lorem.generateWords(1),
      change: random(100, 1000),
    })),
  }));

  return Promise.resolve(values);
};

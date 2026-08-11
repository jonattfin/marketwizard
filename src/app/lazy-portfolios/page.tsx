import LazyPortfoliosList from "@/app/lazy-portfolios/components/portfolios-list";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lazy Portfolios - Market Wizard",
  description: "...",
};

export default function LazyPortfolios() {
  return <LazyPortfoliosList />;
}

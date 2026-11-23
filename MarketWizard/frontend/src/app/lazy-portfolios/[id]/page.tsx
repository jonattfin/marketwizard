import LazyPortfolioDetails from "@/app/lazy-portfolios/[id]/components/lazy-portfolio-details";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Lazy Portfolio Details - Market Wizard",
  description: "...",
};

export default async function LazyPortfolioPage({
  params,
}: Readonly<{
  params: Promise<{ id: string }>;
}>) {
  const { id } = await params;

  return <LazyPortfolioDetails id={id}></LazyPortfolioDetails>;
}

import Watchlist from "@/app/watchlist/components/watchlist";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Watchlist - Market Wizard",
  description: "...",
};

export default function WatchlistPage() {
  return <Watchlist />;
}

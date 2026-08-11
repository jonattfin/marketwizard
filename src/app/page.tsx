import Dashboard from "./dashboard/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home - Market Wizard",
  description: "...",
};

export default function Home() {
  return <Dashboard />;
}

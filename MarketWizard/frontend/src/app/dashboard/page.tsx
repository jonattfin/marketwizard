import { Metadata } from "next";
import Dashboard from "@/app/dashboard/components/dashboard";

export const metadata: Metadata = {
  title: "Home - Market Wizard",
  description: "...",
};

export default async function DashboardPage() {
  return <Dashboard />;
}

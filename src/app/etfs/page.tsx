import {EtfList} from "@/app/etfs/components/etf-list";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'ETFs - Market Wizard',
  description: '...',
}

export default function DiscoverPage() {
  return <EtfList/>
}


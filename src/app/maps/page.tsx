
import {Metadata} from "next";
import MarketMap from "@/app/maps/components/MarketMap";

export const metadata: Metadata = {
  title: 'Maps - Market Wizard',
  description: '...',
}

export default function MapsPage() {
  return (
     <MarketMap/>
  );
}
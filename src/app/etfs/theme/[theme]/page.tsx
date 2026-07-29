import {Metadata} from "next";
import EtfThemeList from "@/app/etfs/theme/[theme]/components/etf-theme-list";

export const metadata: Metadata = {
  title: 'Etf Theme - Market Wizard',
  description: '...',
}

export default async function EtfPage({params}: Readonly<{
  params: Promise<{ theme: string }>
}>) {
  const {theme} = await params;

  return (
    <EtfThemeList theme={theme}></EtfThemeList>
  )
}
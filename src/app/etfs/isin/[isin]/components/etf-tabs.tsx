import { Tabs } from "@chakra-ui/react"
import {LuSquareCheck, LuUser} from "react-icons/lu";
import {Overview} from "@/app/etfs/isin/[isin]/components/overview";
import {Basics} from "@/app/etfs/isin/[isin]/components/basics";
import {Holdings} from "@/app/etfs/isin/[isin]/components/holdings";
import {StockExchange} from "@/app/etfs/isin/[isin]/components/stock-exchange";

export const EtfTabs = () => {
  return (
    <Tabs.Root defaultValue="overview">
      <Tabs.List>
        <Tabs.Trigger value="overview">
          <LuUser/>
          Overview
        </Tabs.Trigger>
        <Tabs.Trigger value="basics">
          <LuSquareCheck/>
          Basics
        </Tabs.Trigger>
        <Tabs.Trigger value="holdings">
          <LuSquareCheck/>
          Holdings
        </Tabs.Trigger>
        <Tabs.Trigger value="stock-exchange">
          <LuSquareCheck/>
          Stock Exchange
        </Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="overview">
        <Overview/>
      </Tabs.Content>
      <Tabs.Content value="basics">
        <Basics/>
      </Tabs.Content>
      <Tabs.Content value="holdings">
        <Holdings/>
      </Tabs.Content>
      <Tabs.Content value="stock-exchange">
        <StockExchange/>
      </Tabs.Content>
    </Tabs.Root>
  )
}
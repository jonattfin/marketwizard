'use client';

import {
  Accordion,
  Flex,
  Grid,
  GridItem, Icon,
} from "@chakra-ui/react";
import MarketPerformance from "@/app/dashboard/components/market-performance";
import IndicesPerformance from "@/app/dashboard/components/indices-performance";
import YoutubeVideo from "@/app/dashboard/components/youtube-video";
import SectorPerformance from "@/app/dashboard/components/sector-performance";
import {LuActivity, LuAxis3D, LuScale, LuFolderSearch, LuNewspaper} from "react-icons/lu";

import News from "@/app/dashboard/components/news";
import {CountryContext} from "@/shared/context/country-context";

import {MarketTreemap} from "@/shared/treemap";
import {useCountries} from "@/shared/use-countries";

export default function Dashboard() {
  const {countries, onCountryChanged} = useCountries();

  const leftItems = getLeftItems();
  const rightItems = getRightItems();

  return (
    <CountryContext.Provider value={countries}>
      <IndicesPerformance onCountryChanged={onCountryChanged}/>
      <div>&nbsp;</div>

      <div>&nbsp;</div>
      <Grid templateColumns={{
        base: '1fr',
        md: 'repeat(1, 1fr)',
        lg: 'repeat(4, 1fr)'
      }} gap="6">
        <GridItem colSpan={3}>
          <Accordion.Root multiple defaultValue={leftItems.map(item => item.value)} size={"md"}>
            {leftItems.map((item) => (
              <Accordion.Item key={item.value} value={item.value}>
                <Accordion.ItemTrigger>
                  <Icon fontSize="lg" color="orange.300">
                    {item.icon}
                  </Icon>
                  {item.title}
                  <Accordion.ItemIndicator/>
                </Accordion.ItemTrigger>
                <Accordion.ItemContent>
                  <Accordion.ItemBody>
                    {item.content}
                    <div>&nbsp;</div>
                  </Accordion.ItemBody>
                </Accordion.ItemContent>
              </Accordion.Item>
            ))}
          </Accordion.Root>

        </GridItem>

        <GridItem>
          <Flex gap="4" direction="column">
            <Accordion.Root multiple defaultValue={rightItems.map(item => item.value)} size={"md"}>
              {rightItems.map((item) => (
                <Accordion.Item key={item.value} value={item.value}>
                  <Accordion.ItemTrigger>
                    <Icon fontSize="lg" color="orange.300">
                      {item.icon}
                    </Icon>
                    {item.title}
                    <Accordion.ItemIndicator/>
                  </Accordion.ItemTrigger>
                  <Accordion.ItemContent>
                    <Accordion.ItemBody>
                      {item.content}
                      <div>&nbsp;</div>
                    </Accordion.ItemBody>
                  </Accordion.ItemContent>
                </Accordion.Item>
              ))}
            </Accordion.Root>
          </Flex>
        </GridItem>
      </Grid>
    </CountryContext.Provider>
  )
}

function getLeftItems() {
  return [
     {
      value: "performance-by-sector",
      icon: <LuAxis3D/>,
      title: "Today's performance by sector",
      content: <SectorPerformance/>
    },
    {value: "top-news", icon: <LuActivity/>, title: "Today's top news", content: <News/>},
    {value: "top-gainers-industries", icon: <LuScale/>, title: "Market performance", content: <MarketPerformance/>},
  ]
}

function getRightItems() {
  return [
    {
      value: "tree-maps",
      icon: <LuFolderSearch/>,
      title: "Map",
      content: <MarketTreemap height={300}/>
    },
    {value: "bloomberg-news", icon: <LuNewspaper/>, title: "Bloomberg news", content: <YoutubeVideo/>},
  ]
}
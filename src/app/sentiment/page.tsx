import {Link, Stack, Text, Blockquote, Grid, GridItem, Badge, Flex, StackSeparator, Breadcrumb} from "@chakra-ui/react"
import LineChart from "@/app/sentiment/components/lineChart";
import LineChart2 from "@/app/sentiment/components/lineChart2";
import {JSX, useMemo} from "react";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: 'Investor Sentiment - Market Wizard',
  description: '...',
}

export default function Sentiment() {
  const items = useMemo<ItemType[]>(() => createItems(), [])

  return (
    <>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator/>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink data-testid={"sentiment-link"}>Fear & Greed Index</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <Stack separator={<>&nbsp;</>}>
        <div>&nbsp;</div>
        <Text textStyle="m">What emotion is driving the market now?</Text>
        <Link variant="underline" href={"#faq"}>Learn more about the index</Link>

        <div>&nbsp;</div>
        <Blockquote.Root>
          <Blockquote.Content>
            7 FEAR & GREED INDICATORS
          </Blockquote.Content>
        </Blockquote.Root>
      </Stack>
      <div>&nbsp;</div>
      <Stack separator={(
        <Stack>
          <StackSeparator/>
          <div>&nbsp;</div>
        </Stack>
      )}>
        {items.map((item) => {
          return (
            <Grid key={item.id} templateColumns={{
              base: '1fr',
              md: 'repeat(1, 1fr)',
              lg: 'repeat(3, 1fr)'
            }} gap="6">
              <GridItem colSpan={2}>
                <Flex gap="4" justify="space-between">
                  <div>
                    <div>{item.title}</div>
                    <div>{item.subtitle}</div>
                  </div>
                  <div>
                    <Badge colorPalette="red" size={"lg"}>{item.sentiment}</Badge>
                  </div>
                </Flex>
                {item.chart}
              </GridItem>
              <GridItem>
                {item.text}
              </GridItem>
            </Grid>
          )
        })}
      </Stack>
      <div>&nbsp;</div>
      <div id={"faq"}>
        <Blockquote.Root>
          <Blockquote.Content>
            FEAR & GREED INDEX FAQs
          </Blockquote.Content>
        </Blockquote.Root>

        <div>&nbsp;</div>
        <Stack separator={<div>&nbsp;</div>}>

          <Text textStyle="xl">What is the CNN Business Fear & Greed Index?</Text>
          <Text textStyle="l">The Fear & Greed Index is a way to gauge stock market movements and whether stocks are
            fairly priced.
            The theory is based on the logic that excessive fear tends to drive down share prices, and too much greed
            tends to have the opposite effect.</Text>

          <Text textStyle="xl">How is Fear & Greed Calculated?</Text>
          <Text textStyle="l">The Fear & Greed Index is a compilation of seven different indicators that measure some
            aspect of stock market behavior. They are market momentum, stock price strength, stock price breadth, put
            and call options, junk bond demand, market volatility, and safe haven demand. The index tracks how much
            these individual indicators deviate from their averages compared to how much they normally diverge. The
            index gives each indicator equal weighting in calculating a score from 0 to 100, with 100 representing
            maximum greediness and 0 signaling maximum fear.</Text>


          <Text textStyle="xl">How often is the Fear & Greed Index calculated?</Text>
          <Text textStyle="l">Every component and the Index are calculated as soon as new data becomes available.</Text>

          <Text textStyle="xl">How to use Fear & Greed Index?</Text>
          <Text textStyle="l">The Fear & Greed Index is used to gauge the mood of the market. Many investors are
            emotional and reactionary, and fear and greed sentiment indicators can alert investors to their own emotions
            and biases that can influence their decisions. When combined with fundamentals and other analytical tools,
            the Index can be a helpful way to assess market sentiment.</Text>

        </Stack>
      </div>
    </>
  )
}

type ItemType = {
  id: number;
  title: string;
  subtitle: string;
  sentiment: string;
  chart: JSX.Element;
  text: string;
};

function createItems(): ItemType[] {
  return [
    {
      id: 1,
      title: "Market Momentum",
      subtitle: "S&P 500 and its 125-day moving average",
      chart: <LineChart/>,
      sentiment: "Fear",
      text: `
    It’s useful to look at stock market levels compared to where they’ve been over the past few months. 
    When the S&P 500 is above its moving or rolling average of the prior 125 trading days, that’s a sign of positive momentum. 
    But if the index is below this average, it shows investors are getting skittish. 
    The Fear & Greed Index uses slowing momentum as a signal for Fear and a growing momentum for Greed.
    `
    },
    {
      id: 2,
      title: "Stock price strength",
      subtitle: "Net new 52-week highs and lows on the NYSE",
      chart: <LineChart2/>,
      sentiment: "Extreme fear",
      text: `
    A few big stocks can skew returns for the market. 
    It’s important to also know how many stocks are doing well versus those that are struggling. 
    This shows the number of stocks on the NYSE at 52-week highs compared to those at 52-week lows. 
    When there are many more highs than lows, that’s a bullish sign and signals Greed.
    `
    },
    {
      id: 3,
      title: "Stock price breath",
      subtitle: "McClellan Volume Summation Index",
      chart: <LineChart2/>,
      sentiment: "Extreme fear",
      text: `
    The market is made up of thousands of stocks. And on any given day, investors are actively buying and selling them. 
    This measure looks at the amount, or volume, of shares on the NYSE that are rising compared to the number of shares that are falling. 
    A low (or even negative) number is a bearish sign. The Fear & Greed Index uses decreasing trading volume as a signal for Fear.
    `
    },
  ]
}


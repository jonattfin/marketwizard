"use client"

import {Chart, useChart} from "@chakra-ui/charts"
import {CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis} from "recharts"
import {ReturnTable} from "@/app/lazy-portfolios/[id]/components/return-table";
import {LazyPortfolioItemType} from "@/shared/types";
import {random} from "es-toolkit";

export type PortfolioReturnsType = {
  items: LazyPortfolioItemType[]
}

const nextRandom = () => random(5, 30).toFixed(2);

export const PortfolioReturns = ({items}: PortfolioReturnsType) => {
  const chart = useChart({
    data: [
      {performance: nextRandom(), month: "January"},
      {performance: nextRandom(), month: "February"},
      {performance: nextRandom(), month: "March"},
      {performance: nextRandom(), month: "May"},
      {performance: nextRandom(), month: "June"},
      {performance: nextRandom(), month: "August"},
    ],
    series: [{name: "performance", color: "teal.solid"}],
  })

  return (
    <>
      <div>&nbsp;</div>

      <Chart.Root maxH="sm" chart={chart}>
        <LineChart data={chart.data}>
          <CartesianGrid stroke={chart.color("border")} vertical={false}/>
          <XAxis
            axisLine={false}
            dataKey={chart.key("month")}
            tickFormatter={(value) => value.slice(0, 3)}
            stroke={chart.color("border")}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            stroke={chart.color("border")}
          />
          <Tooltip
            animationDuration={100}
            cursor={false}
            content={<Chart.Tooltip/>}
          />
          {chart.series.map((item) => (
            <Line
              key={item.name}
              isAnimationActive={false}
              dataKey={chart.key(item.name)}
              stroke={chart.color(item.color)}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </Chart.Root>
      <div>&nbsp;</div>
      <ReturnTable items={items}/>
    </>

  )
}

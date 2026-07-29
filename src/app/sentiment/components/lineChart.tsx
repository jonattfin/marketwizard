"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import { CartesianGrid, Line, LineChart, Tooltip, XAxis, YAxis } from "recharts"
import {random} from "es-toolkit";


const CustomLineChart = () => {
  const nextValue = () => random(5000, 6000).toFixed(0);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const chart = useChart({
    data:  months.map((month) => ({ month, "S&P 500": nextValue(), "125-day MA": nextValue() })),
    series: [
      { name: "S&P 500", color: "teal.solid", strokeDasharray: "5 5" },
      { name: "125-day MA", color: "purple.solid" },
    ],
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <LineChart data={chart.data} margin={{ left: 40, right: 40, top: 40 }}>
        <CartesianGrid
          stroke={chart.color("border")}
          strokeDasharray="3 3"
          horizontal={false}
        />
        <XAxis
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
          stroke={chart.color("border")}
        />
        <YAxis
          dataKey={chart.key("S&P 500")}
          stroke={chart.color("border")}
          domain={[140, "dataMax"]}
        />
        <Tooltip
          animationDuration={100}
          cursor={{ stroke: chart.color("border") }}
          content={<Chart.Tooltip hideLabel />}
        />
        {chart.series.map((item) => (
          <Line
            key={item.name}
            isAnimationActive={false}
            dataKey={chart.key(item.name)}
            stroke={chart.color(item.color)}
            fill={chart.color(item.color)}
            dot={{ strokeDasharray: "0" }}
            strokeWidth={2}
            strokeDasharray={item.strokeDasharray}
          />
        ))}
      </LineChart>
    </Chart.Root>
  )
}

export default CustomLineChart;

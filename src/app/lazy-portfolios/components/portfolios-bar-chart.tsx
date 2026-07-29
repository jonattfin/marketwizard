"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts"

export type PortfoliosBarChartType = {
  name: string;
  performance: number;
}

export const PortfoliosBarChart = ({portfolios}: {portfolios: PortfoliosBarChartType[]}) => {
  const chart = useChart({
    data: portfolios.map((p) => ({ name: `${p.name}`, performance: p.performance })),
    series: [{ name: "performance", color: "teal.solid" }],
  })

  return (
    <Chart.Root maxH="sm" chart={chart} maxWidth={"50%"}>
      <BarChart data={chart.data} margin={{ top: 30 }}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        {chart.series.map((item) => (
          <Bar
            isAnimationActive={false}
            key={item.name}
            radius={4}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
          >
            <LabelList
              position="top"
              dataKey={chart.key("performance")}
              offset={10}
              style={{ fontWeight: "500" }}
            />
            {chart.data.map((item) => (
              <Cell
                key={item.name}
                fill={chart.color(item.performance > 0 ? "green.solid" : "red.solid")}
              />
            ))}
          </Bar>
        ))}
      </BarChart>
    </Chart.Root>
  )
}

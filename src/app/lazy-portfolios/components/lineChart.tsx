"use client"

import { Chart, useChart } from "@chakra-ui/charts"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {random} from "es-toolkit";

export type PortfoliosLineChartType = {
  name: string;
  performance: number;
}

type DataSeriesItem = {
	name: string;
	color:string;
	label: string;
}

type DataItem = {
	month: string;
}

const Demo = ({portfolios}: {portfolios: PortfoliosLineChartType[]}) => {
	const buildData = () => {
		const data : DataItem[] = [];

		const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
		const performance = [1.5, -0.9, -4.9, 10.5, 5.3, -1.3, 0.1]

		months.forEach((month, monthIndex) => {
			const obj:any = {
				month
			};

			portfolios.forEach(portfolio => {
				obj[portfolio.name] = (performance[monthIndex] ?? 0) + random(4);
			});

			data.push(obj)
		})

		return data;
	}

	const buildSeries = () => {
		const series: DataSeriesItem[] = [];

		const colors = ["teal.solid", 'orange', 'green', 'blue', 'red', 'yellow'];

		portfolios.forEach((portfolio, index) => {
				series.push({
					name: portfolio.name,
					color: colors[index] || 'teal.solid',
					label: portfolio.name,
				})
			})

		return series;
	}

	const chart = useChart({
    data: buildData(),
		// @ts-ignore
    series: [
	    ...buildSeries()
    ]
  })

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <LineChart data={chart.data} responsive>
        <CartesianGrid stroke={chart.color("border")} vertical={false} />
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
          content={<Chart.Tooltip />}
        />
        <ReferenceLine
          y={110}
          stroke={chart.color("purple.fg")}
          strokeDasharray="5 5"
          label={{
            value: "Target",
            position: "top",
            fill: chart.color("purple.fg"),
            offset: 10,
          }}
        />
        <Legend content={<Chart.Legend />} />
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
  )
}

export default Demo;
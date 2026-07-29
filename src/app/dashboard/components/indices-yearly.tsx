"use client"

import {Chart, useChart} from "@chakra-ui/charts"
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import {useQuery} from "@tanstack/react-query";
import {IndicesAreaType, IndiceSummaryType} from "@/shared/types"
import Loading from "@/shared/loading";
import { useMemo } from "react";

const useIndicesYearly = () => {
  const {isPending, error, data} = useQuery<IndicesAreaType>({
    queryKey: ["indicesArea"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/yearly");
      return await response.json();
    }
  });

  return {data, error, isPending};
}

export type IndicesYearlyType = {
  indice?: IndiceSummaryType;
}

const IndicesYearly = ({indice}: IndicesYearlyType) => {
  const {data, error, isPending} = useIndicesYearly()

  const chartData = useMemo(() => {
    const items: Record<string, number | string>[] = [];

    data?.performance.forEach((item) => {
      const obj: Record<string, string> = {};

      obj.month = item.month;
      item.indices.forEach((indiceItem) => {
        if (indice) {
          if (indiceItem.name === indice?.name) {
            obj[`${indiceItem.name}`] = String(indiceItem.performance);
          }
        } else {
          obj[`${indiceItem.name}`] = String(indiceItem.performance);
        }

      })

      items.push(obj);
    })

    return items;
  }, [data?.performance, indice]);

  const chartSeries = useMemo(() => {
    const series: Record<string, string>[] = [];

    const buildColor = (index: number) => {
      if (index === 0) return "teal.solid";
      else if (index === 1) return "orange.solid";
      else if (index === 2) return "red.solid";
      else if (index === 3) return "yellow.solid";

      return "blue.solid";
    }

    data?.indices.forEach((indiceItem, index) => {
      if (indice) {
        if (indiceItem === indice?.name) {
          series.push({
            name: indiceItem,
            color: buildColor(index),
          })
        }
      } else {
        series.push({
          name: indiceItem,
          color: buildColor(index),
        })
      }

    })

    return series;
  }, [data?.indices, indice])

  const chart = useChart({
    data: chartData,
    series: chartSeries
  })

  if (isPending) return <Loading/>;
  if (error) return `Page ${error}`;

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <AreaChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false}/>
        <YAxis stroke={chart.color("border")}/>
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip/>}
        />
        <Legend content={<Chart.Legend/>}/>
        <ReferenceLine
          x="Mar"
          label={{
            value: "Trump Tariff's",
            position: "insideTopRight",
            style: {fill: chart.color("red.fg"), fontWeight: "500"},
          }}
          stroke={chart.color("red.solid")}
        />
        {chart.series.map((item) => (
          <Area
            key={item.name}
            isAnimationActive={true}
            dataKey={chart.key(item.name)}
            fill={chart.color(item.color)}
            fillOpacity={0.2}
            stroke={chart.color(item.color)}
            stackId="a"
          />
        ))}
      </AreaChart>
    </Chart.Root>
  )
}

export default IndicesYearly;

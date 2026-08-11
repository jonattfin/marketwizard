"use client";

import { Chart, useChart } from "@chakra-ui/charts";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ReferenceLine,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useQuery } from "@tanstack/react-query";
import { PortfoliosAreaType, PortfolioType } from "@/shared/types";
import Loading from "@/shared/loading";
import { useMemo } from "react";

const usePortfoliosYearly = () => {
  const { isPending, error, data } = useQuery<PortfoliosAreaType>({
    queryKey: ["portfoliosArea"],
    queryFn: async () => {
      const response = await fetch("/api/portfolios/yearly");
      return await response.json();
    },
  });

  return { data, error, isPending };
};

export type PortfoliosYearlyType = {
  portfolio?: PortfolioType;
};

const PortfoliosYearly = ({ portfolio }: PortfoliosYearlyType) => {
  const { data, error, isPending } = usePortfoliosYearly();

  const chartData = useMemo(() => {
    const items: Record<string, number | string>[] = [];

    data?.performance.forEach((item) => {
      const obj: Record<string, string> = {};

      obj.month = item.month;
      item.portfolios.forEach((portfolioItem) => {
        if (portfolio) {
          if (portfolioItem.name === portfolio?.name) {
            obj[`${portfolioItem.name}`] = String(portfolioItem.performance);
          }
        } else {
          obj[`${portfolioItem.name}`] = String(portfolioItem.performance);
        }
      });

      items.push(obj);
    });

    return items;
  }, [data?.performance, portfolio]);

  const chartSeries = useMemo(() => {
    const series: Record<string, string>[] = [];

    const buildColor = (index: number) => {
      if (index === 0) return "teal.solid";
      else if (index === 1) return "orange.solid";
      else if (index === 2) return "red.solid";
      else if (index === 3) return "yellow.solid";

      return "blue.solid";
    };

    data?.portfolios.forEach((portfolioItem, index) => {
      if (portfolio) {
        if (portfolioItem === portfolio?.name) {
          series.push({
            name: portfolioItem,
            color: buildColor(index),
          });
        }
      } else {
        series.push({
          name: portfolioItem,
          color: buildColor(index),
        });
      }
    });

    return series;
  }, [data?.portfolios, portfolio]);

  const chart = useChart({
    data: chartData,
    series: chartSeries,
  });

  if (isPending) return <Loading />;
  if (error) return `Page ${error}`;

  return (
    <Chart.Root maxH="sm" chart={chart}>
      <AreaChart data={chart.data}>
        <CartesianGrid stroke={chart.color("border.muted")} vertical={false} />
        <YAxis stroke={chart.color("border")} />
        <XAxis
          axisLine={false}
          tickLine={false}
          dataKey={chart.key("month")}
          tickFormatter={(value) => value.slice(0, 3)}
        />
        <Tooltip
          cursor={false}
          animationDuration={100}
          content={<Chart.Tooltip />}
        />
        <Legend content={<Chart.Legend />} />
        <ReferenceLine
          x="Mar"
          label={{
            value: "Trump Tariff's",
            position: "insideTopRight",
            style: { fill: chart.color("red.fg"), fontWeight: "500" },
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
  );
};

export default PortfoliosYearly;

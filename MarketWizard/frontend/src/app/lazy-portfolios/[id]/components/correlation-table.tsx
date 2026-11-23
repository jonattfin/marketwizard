"use client";

import { ResponsiveHeatMap } from "@nivo/heatmap";
import { random } from "es-toolkit";
import { useNivoTheme } from "@/shared/nivoTheme";
import { LazyPortfolioItemType } from "@/shared/types";

export type CorrelationTableType = {
  items: LazyPortfolioItemType[];
};

export const CorrelationTable = ({ items }: CorrelationTableType) => {
  const theme = useNivoTheme();
  const data = buildCorrelationData(items);

  return (
    <div style={{ height: 400 }}>
      <ResponsiveHeatMap /* or HeatMap for fixed dimensions */
        data={data}
        theme={theme}
        margin={{ top: 60, right: 90, bottom: 60, left: 90 }}
        // valueFormat=">-.2s"
        axisTop={{ tickRotation: -90 }}
        axisRight={{ legend: "Ticker", legendOffset: 70 }}
        axisLeft={{ legend: "Ticker", legendOffset: -72 }}
        emptyColor="#555555"
        legends={[
          {
            anchor: "bottom",
            translateX: 0,
            translateY: 30,
            length: 400,
            thickness: 8,
            direction: "row",
            tickPosition: "after",
            tickSize: 3,
            tickSpacing: 4,
            tickOverlap: false,
            tickFormat: ">-.2s",
            title: "Value →",
            titleAlign: "start",
            titleOffset: 4,
          },
        ]}
      />
    </div>
  );
};

function buildCorrelationData(items: LazyPortfolioItemType[] = []) {
  const assetAllocation = items.map((item) => item.ticker);

  return assetAllocation.map((asset) => {
    return {
      id: asset,
      data: assetAllocation.map((otherAsset) => {
        const y =
          asset === otherAsset
            ? 1
            : Number.parseFloat(random(0.1, 0.9).toPrecision(2));

        return {
          x: otherAsset,
          y: y,
        };
      }),
    };
  });
}

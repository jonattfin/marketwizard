'use client';

import {ResponsiveChoropleth} from '@nivo/geo'

import countries from './data/world-countries.json';
import {useNivoTheme} from "@/shared/nivoTheme";
import {useEffect} from "react";

type WorldMapType = {
  id: string;
  value: number;
}

const WorldMap = ({data = []}: { data?: WorldMapType[] }) => {
  const nivoTheme = useNivoTheme();

  return (<div style={{height: 400}}>
    <ResponsiveChoropleth /* or Choropleth for fixed dimensions */
      data={data}
      features={countries.features}
      margin={{top: 0, right: 0, bottom: 0, left: 0}}
      colors="nivo"
      theme={nivoTheme}
      domain={[0, 100000]}
      unknownColor="#666666"
      label="properties.name"
      valueFormat=".2s"
      enableGraticule={false}
      graticuleLineColor="#dddddd"
      borderWidth={0.5}
      borderColor="#152538"
      legends={[
        {
          anchor: 'bottom-left',
          direction: 'column',
          justify: true,
          translateX: 20,
          translateY: -100,
          itemsSpacing: 0,
          itemWidth: 94,
          itemHeight: 18,
          itemDirection: 'left-to-right',
          itemTextColor: '#444444',
          itemOpacity: 0.85,
          symbolSize: 18
        }
      ]}
    />
  </div>);
}

export default WorldMap;
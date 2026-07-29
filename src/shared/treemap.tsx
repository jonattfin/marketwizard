import {ResponsiveTreeMap} from '@nivo/treemap'
import {useNivoTheme} from "@/shared/nivoTheme";
import {useQuery} from "@tanstack/react-query";
import {TreeMapType} from "@/shared/types";
import Loading from "@/shared/loading";
import {useContext, useMemo} from "react";
import {CountryContext} from "@/shared/context/country-context";

export type MarketTreemapType = {
  height?: number;
}

const useTreeMap = () => {
  const {isPending, error, data} = useQuery<TreeMapType[]>({
    queryKey: ["tree-maps"],
    queryFn: async () => {
      const response = await fetch(`/api/treemap`);
      return await response.json();
    }
  });

  return {isPending, error, data: data ?? []};
}

export const MarketTreemap = ({height = 800}: MarketTreemapType) => {
  const nivoTheme = useNivoTheme();
  const {isPending, error, data} = useTreeMap();
  const countries = useContext(CountryContext);

  const mapData = useMemo(() => transformData(data, countries), [data, countries]);

  if (isPending) return <Loading/>;
  if (error) return `Page ${error}`;

  return (
    <div style={{height}}>
      <ResponsiveTreeMap /* or TreeMap for fixed dimensions */
        data={mapData}
        identity="name"
        theme={nivoTheme}
        value="loc"
        valueFormat=".02s"
        margin={{top: 10, right: 10, bottom: 10, left: 10}}
        labelSkipSize={12}
        labelTextColor={{from: 'color', modifiers: [['darker', 1.2]]}}
        parentLabelPosition="top"
        parentLabelTextColor={{from: 'color', modifiers: [['darker', 2]]}}
        borderColor={{from: 'color', modifiers: [['darker', 0.1]]}}
      />
    </div>
  )
}

function transformData(data: TreeMapType[], countries: string[]) {
  const children = data.map(d => {

    return {
      name: d.sector,
      children: d.companies.map(c => ({
        name: c.company,
        loc: c.change
      }))
    }

  });

  return {
    name: countries.join(', '),
    children
  }
}

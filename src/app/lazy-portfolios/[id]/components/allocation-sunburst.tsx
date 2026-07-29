import {ResponsiveSunburst} from '@nivo/sunburst'
import {useNivoTheme} from "@/shared/nivoTheme";
import {LazyPortfolioItemType} from "@/shared/types";

type AllocationSunburstType = {
  height?: number;
  items: LazyPortfolioItemType[]
}

export const AllocationSunburst = ({items, height = 300}: AllocationSunburstType) => {
  const nivoTheme = useNivoTheme()

  const data = buildData(items);

  return (
    <div style={{height}}>
      <ResponsiveSunburst /* or Sunburst for fixed dimensions */
        data={data}
        theme={nivoTheme}
        margin={{top: 10, right: 10, bottom: 10, left: 10}}
        cornerRadius={2}
        borderColor={{theme: 'background'}}
        enableArcLabels={true}
        arcLabelsSkipAngle={10}
        arcLabelsTextColor={{from: 'color', modifiers: [['darker', 1.4]]}}
      />
    </div>
  )
}

function buildData(items: LazyPortfolioItemType[]) {

  const getChildren = (itemType: string) => {
    return items.filter(item => item.type === itemType).map(item => {
    return {
      id: `(${item.name}) - ${item.id}`,
      value: item.weight
    }
  });
  }

  return {
    id: "ETF",
    children: [
      {id: "Stocks", children: getChildren("s")},
      {id: "Fixed income", children: getChildren("f")},
      {id: "Commodities", children: getChildren("c")}
    ]
  }
}
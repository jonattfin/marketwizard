'use client';

import {Flex, FormatNumber, Icon, Table, Tag} from "@chakra-ui/react"
import {CountryType, EquityType} from "@/shared/types";
import {useQuery} from "@tanstack/react-query";
import Loading from "@/shared/loading";
import {
  LuBadgeEuro,
  LuBadgeDollarSign,
  LuBadgePoundSterling,
  LuBanknote,
  LuAperture,
} from "react-icons/lu";

const useWorldEquity = () => {
  const {isPending, error, data} = useQuery<EquityType[]>({
    queryKey: ["world-equity"],
    queryFn: async () => {
      const response = await fetch("/api/dashboard/world-equity");
      return await response.json();
    }
  });

  return {
    isPending,
    error,
    data
  }
}

const WorldEquity = () => {
  const {isPending, error, data} = useWorldEquity();

  if (isPending) return <Loading/>
  if (error) return `Page ${error}`;

  return (
    <Flex gap="4" justify={"space-evenly"}>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Country</Table.ColumnHeader>
            <Table.ColumnHeader>Change %</Table.ColumnHeader>
            <Table.ColumnHeader>Last price</Table.ColumnHeader>
            <Table.ColumnHeader textAlign="end">Volume</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {data?.map((item) => (
            <Table.Row key={item.country}>

              <Table.Cell>
                <Icon fontSize="lg" color="fg.subtle">
                  {renderCountryIcon(item.country)}
                </Icon>
                {` ${item.country}`}</Table.Cell>
              <Table.Cell>
                <Tag.Root size="md" variant={"subtle"} colorPalette={item.change > 0 ? "green" : "orange"}>
                  <Tag.Label><FormatNumber
                    value={item.change}
                    style="percent"
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                  /></Tag.Label>
                </Tag.Root>
              </Table.Cell>
              <Table.Cell>
                {item.lastPrice && <FormatNumber value={item.lastPrice} style="currency" currency="USD"/>}
              </Table.Cell>
              <Table.Cell textAlign="end">
                {item.volume && <FormatNumber value={item.volume} style="decimal"/>}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  )
}

const iconsMap = {
  [CountryType.US]: <LuBadgeDollarSign/>,
  [CountryType.CA]: <LuBanknote/>,
  [CountryType.GB]: <LuBadgePoundSterling/>,
  [CountryType.DE]: <LuBadgeEuro/>,
  [CountryType.FR]: <LuBadgeEuro/>,
  [CountryType.AU]: <LuAperture/>,
};

function renderCountryIcon(countryType: CountryType) {
  return iconsMap[countryType] ?? <div>&nbsp;</div>;
}

export default WorldEquity;

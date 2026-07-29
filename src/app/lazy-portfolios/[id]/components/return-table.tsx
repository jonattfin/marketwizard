'use client';

import {FormatNumber, Stack, Table, Tag} from "@chakra-ui/react"
import {random} from "es-toolkit";
import {LazyPortfolioItemType} from "@/shared/types";

export type ReturnTableType = {
  items: LazyPortfolioItemType[];
}

export const ReturnTable = ({items}: ReturnTableType) => {
  const tableData = buildTableData(items);

  const renderPercentage = (value: number) => {
    return (
      <Tag.Root size="md" variant={"subtle"} colorPalette={value > 0 ? "green" : "orange"}>
        <Tag.Label><FormatNumber
          value={value}
          style="percent"
          maximumFractionDigits={2}
          minimumFractionDigits={2}
        /></Tag.Label>
      </Tag.Root>
    )
  }

  return (
    <Stack>
      <div>&nbsp;</div>
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader></Table.ColumnHeader>
            <Table.ColumnHeader>YTD</Table.ColumnHeader>
            <Table.ColumnHeader>1M</Table.ColumnHeader>
            <Table.ColumnHeader>6M</Table.ColumnHeader>
            <Table.ColumnHeader>1Y</Table.ColumnHeader>
            <Table.ColumnHeader>5Y</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {tableData.items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{`${item.name} [${item.ticker}]`}</Table.Cell>
              <Table.Cell>{renderPercentage(item.ytd)}</Table.Cell>
              <Table.Cell>{renderPercentage(item["1m"])}</Table.Cell>
              <Table.Cell>{renderPercentage(item["6m"])}</Table.Cell>
              <Table.Cell>{renderPercentage(item["1y"])}</Table.Cell>
              <Table.Cell>{renderPercentage(item["5y"])}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  )
}

function buildTableData(items: LazyPortfolioItemType[]) {
  const nextValue = () => random(-0.5, 0.5);

  const tableItems = items.map((item) => ({
    id: item.id,
    ticker: item.ticker,
    name: item.name,
     ytd: nextValue(),
      "1m": nextValue(),
      "6m": nextValue(),
      "1y": nextValue(),
      "5y": nextValue()
  }))

  return {
    items: tableItems,
  }
}

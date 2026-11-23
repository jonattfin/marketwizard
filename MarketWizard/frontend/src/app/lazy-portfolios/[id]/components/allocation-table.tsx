"use client";

import { Stack, Table } from "@chakra-ui/react";
import { AllocationSunburst } from "@/app/lazy-portfolios/[id]/components/allocation-sunburst";
import { LazyPortfolioItemType } from "@/shared/types";
import Link from "next/link";

type AllocationTableType = {
  items: LazyPortfolioItemType[];
};

export const AllocationTable = ({ items = [] }: AllocationTableType) => {
  return (
    <Stack>
      <>{`Asset Allocation and ETFs`}</>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <AllocationSunburst items={items} />
      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Weight(%)</Table.ColumnHeader>
            <Table.ColumnHeader>ETF Ticker</Table.ColumnHeader>
            <Table.ColumnHeader>ETF Name</Table.ColumnHeader>
            <Table.ColumnHeader>Investment themes</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>{item.weight}</Table.Cell>
              <Table.Cell>
                <Link href={`/etfs/isin/${item.ticker}`}>{item.ticker}</Link>
              </Table.Cell>
              <Table.Cell>{item.name}</Table.Cell>
              <Table.Cell>{item.themes}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
};

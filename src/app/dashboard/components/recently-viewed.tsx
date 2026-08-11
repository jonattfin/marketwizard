"use client";

import { useEffect, useState } from "react";
import Loading from "@/shared/loading";
import { FormatNumber, Table, Tag } from "@chakra-ui/react";
import Link from "next/link";

const RecentlyViewed = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  });

  if (loading) return <Loading />;

  return (
    <Table.Root size="sm" interactive>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Symbol</Table.ColumnHeader>
          <Table.ColumnHeader>7D</Table.ColumnHeader>
          <Table.ColumnHeader textAlign="end">1Y</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>
              <>
                <div>
                  <Link href={`/stocks/${item.symbol}`}>{item.symbol}</Link>
                </div>
                <div>
                  <FormatNumber
                    value={item.price}
                    style="currency"
                    currency="USD"
                  />
                </div>
                <div>{item.company}</div>
              </>
            </Table.Cell>
            <Table.Cell>
              <Tag.Root
                size="md"
                variant={"subtle"}
                colorPalette={item["7d"] > 0 ? "green" : "orange"}
              >
                <Tag.Label>
                  <FormatNumber
                    value={item["7d"]}
                    style="percent"
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                  />
                </Tag.Label>
              </Tag.Root>
            </Table.Cell>
            <Table.Cell textAlign="end">
              <Tag.Root
                size="md"
                variant={"subtle"}
                colorPalette={item["1y"] > 0 ? "green" : "orange"}
              >
                <Tag.Label>
                  <FormatNumber
                    value={item["1y"]}
                    style="percent"
                    maximumFractionDigits={2}
                    minimumFractionDigits={2}
                  />
                </Tag.Label>
              </Tag.Root>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const items = [
  {
    id: 1,
    symbol: "TGT",
    price: 100,
    company: "Microsoft",
    "7d": -0.06,
    "1y": -0.4,
  },
  {
    id: 2,
    symbol: "AAPL",
    price: 200,
    company: "Apple",
    "7d": 0.12,
    "1y": 0.5,
  },
  { id: 3, symbol: "TGT", price: 200, company: "Apple", "7d": 0.12, "1y": 0.5 },
  {
    id: 4,
    symbol: "ESTC",
    price: 200,
    company: "Apple",
    "7d": 0.12,
    "1y": 0.5,
  },
];

export default RecentlyViewed;

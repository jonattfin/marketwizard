import { Table } from "@chakra-ui/react";

export const Basics = () => {
  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Data</Table.ColumnHeader>
          <Table.ColumnHeader></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.name}</Table.Cell>
            <Table.Cell>{item.description}</Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const items = [
  { id: 1, name: "Index", description: "MarketVector Global Defense Industry" },
  {
    id: 2,
    name: "Investment focus",
    description: "Equity, World, Industrials",
  },
  { id: 3, name: "Fund size", description: "EUR 5,908 m" },
  { id: 4, name: "Total expense ratio", description: "0.55% p.a." },
  { id: 5, name: "Replication", description: "Physical (Full replication)" },

  { id: 6, name: "Legal structure", description: "ETF" },
  { id: 7, name: "Currency risk", description: "Currency unhedged" },
  { id: 8, name: "Fund domicile", description: "Ireland" },
  { id: 9, name: "Fund provider", description: "VanEck" },
];

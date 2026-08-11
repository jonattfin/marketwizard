import { Table } from "@chakra-ui/react";

export const EtfTable = () => {
  return (
    <Table.Root size="sm">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>TER</Table.ColumnHeader>
          <Table.ColumnHeader>Distribution policy</Table.ColumnHeader>
          <Table.ColumnHeader>Replication</Table.ColumnHeader>
          <Table.ColumnHeader>Fund size</Table.ColumnHeader>
          <Table.ColumnHeader>Inception date</Table.ColumnHeader>
          <Table.ColumnHeader>Holdings</Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row>
          <Table.Cell>{item.ter}</Table.Cell>
          <Table.Cell>{item.distributionPolicy}</Table.Cell>
          <Table.Cell>{item.replicationMethod}</Table.Cell>
          <Table.Cell>{item.fundSize}</Table.Cell>
          <Table.Cell>{item.inceptionDate}</Table.Cell>
          <Table.Cell>{item.holdings}</Table.Cell>
        </Table.Row>
      </Table.Body>
    </Table.Root>
  );
};

export const item = {
  isin: "IE000YYE6WK5",
  ticker: "DEFN",
  name: "VanEck Defense UCITS Etf",
  fundSize: 6118,
  ter: 0.55,
  distributionPolicy: "Accumulating",
  fundDomicile: "Ireland",
  replicationMethod: "Full replication",
  inceptionDate: "2021-01-01",
  holdings: 32,
};

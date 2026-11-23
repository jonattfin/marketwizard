import { Grid, Table, GridItem, Progress } from "@chakra-ui/react";

export const Holdings = () => {
  return (
    <Grid
      templateColumns={{
        base: "1fr",
        md: "repeat(1, 1fr)",
        lg: "repeat(2, 1fr)",
      }}
      gap="6"
    >
      <GridItem colSpan={1}>
        <TopHoldingsTable />
      </GridItem>
      <GridItem colSpan={1}>
        <CountriesTable />
      </GridItem>
    </Grid>
  );
};

const TopHoldingsTable = () => {
  const items = [
    { id: 1, name: "Palantir Technologies Inc.", percentage: 8.95 },
    { id: 2, name: "RTX", percentage: 8.57 },
    { id: 3, name: "Thales SA", percentage: 7.69 },
    { id: 4, name: "Leonardo SpA", percentage: 7.31 },
    { id: 5, name: "Elbit Systems", percentage: 3.94 },

    { id: 6, name: "AeroVironment", percentage: 3.29 },
  ];

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Top 6 holdings</Table.ColumnHeader>
          <Table.ColumnHeader></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.name}</Table.Cell>
            <Table.Cell>
              {item.percentage.toFixed(2) + "%"}
              <Progress.Root
                maxW="240px"
                defaultValue={item.percentage}
                colorPalette={"blue"}
              >
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

const CountriesTable = () => {
  const items = [
    { id: 1, name: "United States", percentage: 49.21 },
    { id: 2, name: "South Korea", percentage: 11.6 },
    { id: 3, name: "France", percentage: 9.48 },
    { id: 4, name: "Italy", percentage: 7.31 },
    { id: 5, name: "Others", percentage: 22.4 },
  ];

  return (
    <Table.Root>
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeader>Countries</Table.ColumnHeader>
          <Table.ColumnHeader></Table.ColumnHeader>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {items.map((item) => (
          <Table.Row key={item.id}>
            <Table.Cell>{item.name}</Table.Cell>
            <Table.Cell>
              {item.percentage.toFixed(2) + "%"}
              <Progress.Root
                maxW="240px"
                defaultValue={item.percentage}
                colorPalette={"orange"}
              >
                <Progress.Track>
                  <Progress.Range />
                </Progress.Track>
              </Progress.Root>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table.Root>
  );
};

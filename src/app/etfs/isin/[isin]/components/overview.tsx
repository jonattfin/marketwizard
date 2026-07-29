import {Button, DownloadTrigger, Grid, GridItem, Table} from "@chakra-ui/react"
import {LuImageDown} from "react-icons/lu";

export const Overview = () => {
  return (
    <>
      <div>&nbsp;</div>
      <div>
        The VanEck Defense UCITS ETF A seeks to track the MarketVector Global Defense Industry index. The MarketVector
        Global Defense Industry index tracks the performance of companies worldwide that are engaged in the military or
        defense industry.
      </div>
      <div>&nbsp;</div>
      <Grid templateColumns={{
        base: '1fr',
        md: 'repeat(2, 1fr)',
        lg: 'repeat(3, 1fr)'
      }} gap="6">
        <GridItem colSpan={1}>
          <Table.Root>
            <Table.Header>
              <Table.Row>
                <Table.ColumnHeader>Documents</Table.ColumnHeader>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {items.map((item) => (
                <Table.Row key={item.id}>
                  <Table.Cell>
                    <DownloadTrigger
                      data={item.name}
                      fileName={item.name + ".txt"}
                      mimeType="text/plain"
                      asChild
                    >
                      <Button variant="ghost"> <LuImageDown/> {item.name}</Button>
                    </DownloadTrigger>

                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Root>
        </GridItem>
      </Grid>

    </>
  )
}

const items = [
  {id: 1, name: "Factsheet",},
  {id: 2, name: "Semi-annual report",},
  {id: 3, name: "Annual report",},
]
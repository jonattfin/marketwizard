import {Table} from "@chakra-ui/react"

export const StockExchange = () => {
  return (
    <>
      <div>&nbsp;</div>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>Listing</Table.ColumnHeader>
            <Table.ColumnHeader>Ticker</Table.ColumnHeader>
            <Table.ColumnHeader>Trade currency</Table.ColumnHeader>
            <Table.ColumnHeader>Market maker</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {items.map((item) => (
            <Table.Row key={item.id}>
              <Table.Cell>
                {item.listing}
              </Table.Cell>
              <Table.Cell>
                {item.ticker}
              </Table.Cell>
              <Table.Cell>
                {item.currency}
              </Table.Cell>
              <Table.Cell>
                {item.marketMaker}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </>
  )
}

const items = [
  {id: 1, listing: "Euronext Paris", ticker: "DFNS", currency: "EUR", marketMaker: "Flow Traders B.V."},
  {id: 2, listing: "London Stock Exchange", ticker: "DFNS", currency: "EUR", marketMaker: "Flow Traders B.V."},
  {id: 3, listing: "Swiss Exchange", ticker: "DFNS", currency: "EUR", marketMaker: "Flow Traders B.V."},
  {id: 4, listing: "Xetra", ticker: "DFNS", currency: "EUR", marketMaker: "Flow Traders B.V."},
]
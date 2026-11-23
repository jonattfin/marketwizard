import { Breadcrumb, Button, Flex, Group } from "@chakra-ui/react";
import { EtfTable, item } from "@/app/etfs/isin/[isin]/components/etf-table";
import { EtfTabs } from "@/app/etfs/isin/[isin]/components/etf-tabs";

export default function EtfDetailsPage() {
  return (
    <>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Link href="/etfs">ETFs</Breadcrumb.Link>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>{item.name}</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>

      <div>&nbsp;</div>

      <Flex justify="flex-end">
        <Group>
          <Button disabled>Watchlist</Button>
          <Button disabled>Add to portfolio</Button>
        </Group>
      </Flex>
      <div>&nbsp;</div>
      <EtfTable />
      <div>&nbsp;</div>
      <EtfTabs />
    </>
  );
}

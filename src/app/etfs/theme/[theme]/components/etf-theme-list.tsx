"use client";

import {
  Breadcrumb,
  ButtonGroup,
  Center,
  Grid,
  GridItem,
  IconButton,
  Image,
  Pagination,
  Table,
} from "@chakra-ui/react";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { EtfThemeByIdType } from "@/shared/types";
import Loading from "@/shared/loading";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";

export type EtfThemeListProps = {
  theme: string;
};

const useEtfTheme = (theme: string) => {
  const { isPending, error, data } = useQuery<EtfThemeByIdType>({
    queryKey: ["etf-theme", theme],
    queryFn: async () => {
      const response = await fetch(`/api/etfs//${theme}`);
      return await response.json();
    },
  });

  return { isPending, error, data: data };
};

export default function EtfThemeList({ theme }: Readonly<EtfThemeListProps>) {
  const { isPending, error, data: etf } = useEtfTheme(theme);

  if (isPending) return <Loading />;
  if (error || !etf) return `Page ${error}`;

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
            <Breadcrumb.CurrentLink>{etf?.name}</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <div>&nbsp;</div>

      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(1, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap="6"
      >
        <GridItem colSpan={1}>
          <Image rounded="md" src={etf?.imageUrl} alt="" />
        </GridItem>
        <GridItem colSpan={2}>{etf?.description}</GridItem>
        <GridItem colSpan={2}></GridItem>
      </Grid>

      <Table.Root size="sm">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>ETF name / ISIN</Table.ColumnHeader>
            <Table.ColumnHeader>Fund size</Table.ColumnHeader>
            <Table.ColumnHeader>TER</Table.ColumnHeader>
            <Table.ColumnHeader>Use of profits</Table.ColumnHeader>
            <Table.ColumnHeader>Fund domicile</Table.ColumnHeader>
            <Table.ColumnHeader>Replication method</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {etf?.items.map((item) => (
            <Table.Row key={item.isin}>
              <Table.Cell>
                <Link href={`/etfs/isin/${item.isin}`}>{item.name}</Link>
              </Table.Cell>
              <Table.Cell>{item.fundSize}</Table.Cell>
              <Table.Cell>{item.ter}</Table.Cell>
              <Table.Cell>{item.useOfProfits}</Table.Cell>
              <Table.Cell>{item.fundDomicile}</Table.Cell>
              <Table.Cell>{item.replicationMethod}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>

      <div>&nbsp;</div>
      <Center>
        <Pagination.Root
          count={5}
          pageSize={5}
          page={1}
          onPageChange={() => {}}
        >
          <ButtonGroup variant="ghost" size="sm" wrap="wrap">
            <Pagination.PrevTrigger asChild>
              <IconButton>
                <LuChevronLeft />
              </IconButton>
            </Pagination.PrevTrigger>

            <Pagination.Items
              render={(page) => (
                <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                  {page.value}
                </IconButton>
              )}
            />

            <Pagination.NextTrigger asChild>
              <IconButton>
                <LuChevronRight />
              </IconButton>
            </Pagination.NextTrigger>
          </ButtonGroup>
        </Pagination.Root>
      </Center>
    </>
  );
}

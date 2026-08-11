"use client";

import {
  Text,
  ButtonGroup,
  Center,
  Flex,
  IconButton,
  Pagination,
  Separator,
  Switch,
  Breadcrumb,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LazyPortfolioType } from "@/shared/types";
import Loading from "@/shared/loading";
import { LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { useState } from "react";

import LazyPortfoliosCards from "@/app/lazy-portfolios/components/lazy-portfolios-cards";
import { PortfoliosTable } from "@/app/lazy-portfolios/components/portfolios-table";

const useLazyPortfolios = (pageNumber: number, pageSize: number) => {
  const { isPending, error, data } = useQuery<[number, LazyPortfolioType[]]>({
    queryKey: ["lazy-portfolios", pageNumber, pageSize],
    queryFn: async () => {
      const response = await fetch(
        `/api/lazy-portfolios/all?pageNumber=${encodeURIComponent(pageNumber)}&pageSize=${pageSize}`,
      );
      return await response.json();
    },
  });

  return { isPending, error, data: data ?? [0, []] };
};

export default function LazyPortfoliosList() {
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize] = useState(5);
  const [view, setView] = useState(true);

  const { isPending, error, data } = useLazyPortfolios(pageNumber, pageSize);

  if (isPending) return <Loading />;
  if (error) return `Page ${JSON.stringify(error)}`;

  const [numberOfLazyPortfolios, items = []] = data;

  return (
    <>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink data-testid={"lazy-portfolio-link"}>
              Lazy Portfolios
            </Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <div>&nbsp;</div>

      <Text textStyle={"m"} color={"gray.500"}>
        A Lazy Portfolio is a collection of investments that requires very
        little maintenance. It’s the typical passive investing strategy, for
        long-term investors, with time horizons of more than 10 years. It’s
        called lazy because you don’t actively manage your portfolio. It’s the
        so called buy and hold investing strategy, designed to achieve a
        long-term financial independence. That means no active trading, no
        checking your stocks every day, and no paying some hedge fund manager
        (who won’t beat the market anyway) to handle your money.
      </Text>
      <div>&nbsp;</div>
      <Flex justify="flex-end">
        <Switch.Root checked={view} onCheckedChange={(e) => setView(e.checked)}>
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label>Change view</Switch.Label>
        </Switch.Root>
      </Flex>
      <div>&nbsp;</div>
      {view ? (
        <PortfoliosTable items={items} />
      ) : (
        <LazyPortfoliosCards portfolios={items} />
      )}
      <div>&nbsp;</div>
      <Separator />
      <div>&nbsp;</div>
      <Center>
        <Pagination.Root
          count={numberOfLazyPortfolios}
          pageSize={pageSize}
          page={pageNumber}
          onPageChange={(page) => setPageNumber(page.page)}
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

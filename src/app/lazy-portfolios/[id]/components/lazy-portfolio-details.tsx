'use client';

import {AllocationTable} from "@/app/lazy-portfolios/[id]/components/allocation-table";
import {PortfolioReturns} from "@/app/lazy-portfolios/[id]/components/portfolio-returns";
import {Breadcrumb, Stack, Tabs} from "@chakra-ui/react";
import {LuSquareCheck, LuUser} from "react-icons/lu";
import {CorrelationTable} from "@/app/lazy-portfolios/[id]/components/correlation-table";
import {LazyPortfolioType} from "@/shared/types";
import {useQuery} from "@tanstack/react-query";
import Loading from "@/shared/loading";

const useLazyPortfolioById = (id: string | undefined) => {
  const {isPending, error, data} = useQuery<LazyPortfolioType | undefined>({
    queryKey: ["lazy-portfolio", id],
    queryFn: async () => {
      const response = await fetch(`/api/lazy-portfolios/${id}`);
      return await response.json();
    }
  });

  return {isPending, error, data};
}

export type LazyPortfolioDetailsType = {
  id: string
}

export default function LazyPortfolioDetails({id}: Readonly<LazyPortfolioDetailsType>) {
  const {isPending, error, data: portfolio} = useLazyPortfolioById(id)

  if (isPending) return <Loading/>;
  if (error || !portfolio) return `Page ${error}`;

  return (
    <Stack>
      <div>&nbsp;</div>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator/>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/lazy-portfolios">Lazy Portfolios</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator/>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink data-testid={"portfolio-title"}>{portfolio?.name}</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <div>&nbsp;</div>
      <div>{portfolio?.description}</div>
      <div>&nbsp;</div>
      <AllocationTable items={portfolio?.items}/>
      <div>&nbsp;</div>
      <Tabs.Root defaultValue="Performance">
        <Tabs.List>
          <Tabs.Trigger value="Performance">
            <LuUser/>
            Performance
          </Tabs.Trigger>
          <Tabs.Trigger value="Correlations">
            <LuSquareCheck/>
            Correlations
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Performance">
          <PortfolioReturns items={portfolio?.items}/>
        </Tabs.Content>
        <Tabs.Content value="Correlations">
          <div style={{width: "100%", height: "100%", overflow: "auto"}}>
            <CorrelationTable items={portfolio?.items}/>
          </div>
        </Tabs.Content>
      </Tabs.Root>
    </Stack>
  )
}
"use client";

import Loading from "@/shared/loading";
import { FormatNumber, Table, Tag } from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import {
  GainersDataType,
  LosersDataType,
  SectorType,
  TopIndustriesDataType,
  WorstIndustriesDataType,
} from "@/shared/types";
import { useContext } from "react";
import { CountryContext } from "@/shared/context/country-context";
import { lastUpdatedAt } from "@/shared/helpers";

const useGainers = (period: number) => {
  const countries = useContext(CountryContext);

  const { isPending, error, data } = useQuery<GainersDataType>({
    queryKey: ["top-gainers", period, countries],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/gainers?period=${encodeURIComponent(period)}&countries=${encodeURIComponent(JSON.stringify(countries))}`,
      );
      return await response.json();
    },
  });

  return {
    isPending,
    error,
    data,
  };
};

const useLosers = (period: number) => {
  const countries = useContext(CountryContext);

  const { isPending, error, data } = useQuery<LosersDataType>({
    queryKey: ["top-losers", period, countries],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/losers?period=${encodeURIComponent(period)}&countries=${encodeURIComponent(JSON.stringify(countries))}`,
      );
      return await response.json();
    },
  });

  return {
    isPending,
    error,
    data: data,
  };
};

const useTopIndustries = (period: number) => {
  const countries = useContext(CountryContext);

  const { isPending, error, data } = useQuery<TopIndustriesDataType>({
    queryKey: ["top-industries", period, countries],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/top-industries?period=${encodeURIComponent(period)}&countries=${encodeURIComponent(JSON.stringify(countries))}`,
      );
      return await response.json();
    },
  });

  return {
    isPending,
    error,
    data: data,
  };
};

const useWorstIndustries = (period: number) => {
  const countries = useContext(CountryContext);

  const { isPending, error, data } = useQuery<WorstIndustriesDataType>({
    queryKey: ["worst-industries", period, countries],
    queryFn: async () => {
      const response = await fetch(
        `/api/dashboard/worst-industries?period=${encodeURIComponent(period)}&countries=${encodeURIComponent(JSON.stringify(countries))}`,
      );
      return await response.json();
    },
  });

  return {
    isPending,
    error,
    data: data,
  };
};

export const TopGainers = ({ period }: { period: number }) => {
  const { isPending, error, data } = useGainers(period);

  if (isPending) return <Loading />;
  if (error) return `Page ${error}`;

  return <SharedComponent {...data} />;
};

export const TopLosers = ({ period }: { period: number }) => {
  const { isPending, error, data } = useLosers(period);

  if (isPending) return <Loading />;
  if (error) return `Page ${error}`;

  return <SharedComponent {...data} />;
};

export const TopIndustries = ({ period }: { period: number }) => {
  const { isPending, error, data } = useTopIndustries(period);

  if (isPending) return <Loading />;
  if (error) return `Page ${error}`;

  return <SharedComponent {...data} />;
};

export const WorstIndusties = ({ period }: { period: number }) => {
  const { isPending, error, data } = useWorstIndustries(period);

  if (isPending) return <Loading />;
  if (error) return `Page ${error}`;

  return <SharedComponent {...data} />;
};

type SharedType = {
  items?: { type: SectorType; change: number; country: string }[];
  date?: Date;
};

const SharedComponent = ({ items, date }: SharedType) => {
  return (
    <>
      <Table.Root size="sm" interactive>
        <Table.Body>
          {items?.map((item) => (
            <Table.Row key={item.type}>
              <Table.Cell>
                <div>{item.type}</div>
              </Table.Cell>
              <Table.Cell textAlign="end">
                <Tag.Root
                  size="md"
                  variant={"subtle"}
                  colorPalette={item.change > 0 ? "green" : "orange"}
                >
                  <Tag.Label>
                    <FormatNumber
                      value={item.change}
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
      {lastUpdatedAt(date)}
    </>
  );
};

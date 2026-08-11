"use client";

import { EtfThemeType } from "@/shared/types";
import { Breadcrumb, Card, Grid, Image } from "@chakra-ui/react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import Loading from "@/shared/loading";

const useEtfThemes = () => {
  const { isPending, error, data } = useQuery<EtfThemeType[]>({
    queryKey: ["etf-themes"],
    queryFn: async () => {
      const response = await fetch("/api/etfs/all");
      return await response.json();
    },
  });

  return { isPending, error, data: data ?? [] };
};

export function EtfList() {
  const { isPending, error, data } = useEtfThemes();

  if (isPending) return <Loading />;
  if (error) return `Page ${JSON.stringify(error)}`;

  return (
    <>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator />
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink>ETFs</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <div>&nbsp;</div>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap="6"
      >
        {data.map((etf) => (
          <div key={etf.id}>
            <EtfCard etf={etf} />
          </div>
        ))}
      </Grid>
      <br />
    </>
  );
}

type EtfCardType = {
  readonly etf: EtfThemeType;
};

function EtfCard({ etf }: EtfCardType) {
  return (
    <Link href={`/etfs/theme/${etf.theme}`}>
      <Card.Root overflow="hidden" variant={"subtle"}>
        <Image src={`${etf.imageUrl}`} height={250} alt=""></Image>
        <Card.Body gap="2">
          <Card.Title data-testid={etf.id}>{etf.name}</Card.Title>
        </Card.Body>
      </Card.Root>
    </Link>
  );
}

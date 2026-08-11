import { Card, Center, Grid } from "@chakra-ui/react";
import { LazyPortfolioType } from "@/shared/types";
import Link from "next/link";
import { AllocationSunburst } from "@/app/lazy-portfolios/[id]/components/allocation-sunburst";

export type PortfoliosCardsType = {
  readonly portfolios: LazyPortfolioType[];
};

export default function LazyPortfoliosCards({
  portfolios,
}: PortfoliosCardsType) {
  return (
    <>
      <Grid
        templateColumns={{
          base: "1fr",
          md: "repeat(2, 1fr)",
          lg: "repeat(3, 1fr)",
        }}
        gap="6"
      >
        {portfolios.map((portfolio) => (
          <div key={portfolio.id}>
            <PortfoliosCards {...{ portfolio }} />
          </div>
        ))}
      </Grid>
      <br />
    </>
  );
}

type PortfolioCardType = {
  readonly portfolio: LazyPortfolioType;
};

function PortfoliosCards({ portfolio }: PortfolioCardType) {
  return (
    <Card.Root overflow="hidden" variant={"subtle"}>
      <Card.Body gap="1">
        <Card.Title data-testid={portfolio.id}>
          <Center>
            <Link href={`/lazy-portfolios/${portfolio.id}`}>
              {portfolio.name}
            </Link>
          </Center>
        </Card.Title>
        <AllocationSunburst height={200} items={portfolio.items} />
      </Card.Body>
    </Card.Root>
  );
}

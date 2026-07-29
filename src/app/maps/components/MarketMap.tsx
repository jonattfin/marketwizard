'use client';

import {MarketTreemap} from "@/shared/treemap";
import {Breadcrumb, Grid, GridItem} from "@chakra-ui/react";
import IndicesPerformance from "@/app/dashboard/components/indices-performance";

import {CountryContext} from "@/shared/context/country-context";
import {useCountries} from "@/shared/use-countries";

export default function MarketMap() {
  const {countries, onCountryChanged} = useCountries();

  return (
    <>
      <Breadcrumb.Root>
        <Breadcrumb.List>
          <Breadcrumb.Item>
            <Breadcrumb.Link href="/">Home</Breadcrumb.Link>
          </Breadcrumb.Item>
          <Breadcrumb.Separator/>
          <Breadcrumb.Item>
            <Breadcrumb.CurrentLink data-testid={"maps-link"}>Maps</Breadcrumb.CurrentLink>
          </Breadcrumb.Item>
        </Breadcrumb.List>
      </Breadcrumb.Root>
      <div>&nbsp;</div>
      <CountryContext.Provider value={countries}>
        <Grid templateColumns={{
          base: '1fr',
          md: 'repeat(1, 1fr)',
          lg: 'repeat(1, 1fr)'
        }} gap="6">
          <GridItem colSpan={3}>
            <IndicesPerformance onCountryChanged={onCountryChanged}/>
          </GridItem>
        </Grid>
        <div>&nbsp;</div>
        <MarketTreemap/>
      </CountryContext.Provider>
    </>
  )
}
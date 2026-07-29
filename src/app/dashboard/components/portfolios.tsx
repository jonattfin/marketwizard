import {Grid, GridItem} from "@chakra-ui/react";
import PortfoliosYearly from "@/shared/portfolios-yearly";
// import PortfoliosPerformance from "@/app/portfolios/components/portfolios-performance";

const Portfolios = () => {
  return (
    <Grid templateColumns="repeat(4, 1fr)" gap="6">
      <GridItem colSpan={3}>
        <PortfoliosYearly/>
      </GridItem>

      <GridItem>
        {/*<PortfoliosPerformance/>*/}
      </GridItem>
    </Grid>
  )
}

export default Portfolios;
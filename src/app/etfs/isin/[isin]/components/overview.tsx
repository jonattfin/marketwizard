import {Button, DownloadTrigger, Grid, GridItem, Stack, StackSeparator} from "@chakra-ui/react"
import {LuImageDown} from "react-icons/lu";
import LineChart3 from "./lineChart";

export const Overview = () => {
	return (
		<>
			<div>&nbsp;</div>
			<div>
				The VanEck Defense UCITS ETF A seeks to track the MarketVector Global Defense Industry index. The MarketVector
				Global Defense Industry index tracks the performance of companies worldwide that are engaged in the military or
				defense industry.
			</div>
			<div>&nbsp;</div>
			<Grid templateColumns={{
				base: '1fr',
				md: 'repeat(2, 1fr)',
				lg: 'repeat(3, 1fr)'
			}}>
				<GridItem colSpan={1}>
					<Stack direction="row" separator={<StackSeparator/>}>
						{items.map((item) => (
							<div key={item.id}>
								<DownloadTrigger
									data={item.name}
									fileName={item.name + ".txt"}
									mimeType="text/plain"
									asChild
								>
									<Button variant="ghost"> <LuImageDown/> {item.name}</Button>
								</DownloadTrigger>
							</div>
						))}
					</Stack>
				</GridItem>
			</Grid>
      <div>&nbsp;</div>
			<LineChart3/>
		</>
	)
}

const items = [
	{id: 1, name: "Factsheet",},
	{id: 2, name: "Semi-annual report",},
	{id: 3, name: "Annual report",},
]
import {
	Center,
	FormatNumber,
	Grid,
	GridItem,
	Stack,
	Table,
	Tag
} from "@chakra-ui/react";
import {LazyPortfolioType} from "@/shared/types";
import Link from "next/link";

import {PortfoliosBarChart} from "@/app/lazy-portfolios/components/portfolios-bar-chart";
import LineChart from "./lineChart";

type PortfoliosTableType = {
	items: LazyPortfolioType[]
}

export const PortfoliosTable = ({items}: PortfoliosTableType) => {
	return (
		<Stack>
			<Stack width="full" gap="5">
				<Table.Root size="sm" variant="outline">
					<Table.Header>
						<Table.Row>
							<Table.ColumnHeader>Portfolio name</Table.ColumnHeader>
							<Table.ColumnHeader textAlign="end">1D return</Table.ColumnHeader>
							<Table.ColumnHeader textAlign="end">YTD return</Table.ColumnHeader>
							<Table.ColumnHeader textAlign="end">Dividend yield</Table.ColumnHeader>
							<Table.ColumnHeader textAlign="end">Performance rank</Table.ColumnHeader>
							<Table.ColumnHeader textAlign="end">Expense ratio</Table.ColumnHeader>
							<Table.ColumnHeader textAlign="end">Sharpe ratio</Table.ColumnHeader>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{items.map((item) => (
							<Table.Row key={item.id}>
								<Table.Cell>
									<Link href={"/lazy-portfolios/" + item.id}>
										{item.name}
									</Link>
								</Table.Cell>
								<Table.Cell textAlign="end">
									<Tag.Root size="md" variant={"subtle"} colorPalette={item["1d"] > 0 ? "green" : "orange"}>
										<Tag.Label><FormatNumber
											value={item["1d"]}
											style="percent"
											maximumFractionDigits={2}
											minimumFractionDigits={2}
										/></Tag.Label>
									</Tag.Root>
								</Table.Cell>
								<Table.Cell textAlign="end">
									<Tag.Root size="md" variant={"subtle"} colorPalette={item.ytd > 0 ? "green" : "orange"}>
										<Tag.Label><FormatNumber
											value={item.ytd}
											style="percent"
											maximumFractionDigits={2}
											minimumFractionDigits={2}
										/></Tag.Label>
									</Tag.Root>
								</Table.Cell>
								<Table.Cell textAlign="end">{item.dividendYield}%</Table.Cell>
								<Table.Cell textAlign="end">{item.performanceRank}</Table.Cell>
								<Table.Cell textAlign="end">{item.expenseRatio}%</Table.Cell>
								<Table.Cell textAlign="end">{item.sharpeRatio}</Table.Cell>
							</Table.Row>
						))}
					</Table.Body>
				</Table.Root>
			</Stack>
			<div>&nbsp;</div>
			<Stack>
				<Center>
					<LineChart portfolios={items.map(item => ({
							name: item.name,
							performance: Number.parseFloat((item.ytd * 100).toFixed(2))
						}))}/>
				</Center>
				<Center>
					<PortfoliosBarChart
						portfolios={items.map(item => ({
							name: item.name,
							performance: Number.parseFloat((item.ytd * 100).toFixed(2))
						}))}/>
				</Center>
			</Stack>
		</Stack>
	)
}
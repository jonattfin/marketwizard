'use client';

import Loading from "@/shared/loading";
import {Grid, GridItem} from "@chakra-ui/react";
import {useQuery} from "@tanstack/react-query";
import {IndicePerformanceDataType} from "@/shared/types";

import React, {Suspense, useContext, useEffect, useMemo} from "react";
import {CountryContext} from "@/shared/context/country-context";
import {IndicesTable} from "@/shared/indices-table";

const WorldMap = React.lazy(
	() =>
		import("@/app/dashboard/components/world-map")
);

export const useIndicesPerformance = () => {
	const {isPending, error, data} = useQuery<IndicePerformanceDataType>({
		queryKey: ["indices-performance"],
		queryFn: async () => {
			const response = await fetch("/api/dashboard/performance");
			return await response.json();
		}
	});

	return {isPending, error, data};
}

type IndicesPerformanceType = {
	onCountryChanged: (countryCode: string, checked: boolean) => void;
}

const IndicesPerformance = ({onCountryChanged}: IndicesPerformanceType) => {
	const {isPending, error, data} = useIndicesPerformance();
	const countries = useContext(CountryContext);

	if (isPending) return <Loading/>;
	if (error) return `Page ${error}`;

	const selectedIndices = data?.items?.filter(item => countries.includes(item.countryCode))
		.map(item => {
			return {id: item.countryCode, value: item.points};
		})

	return (
		<Grid templateColumns={{
			base: '1fr',
			md: 'repeat(1, 1fr)',
			lg: 'repeat(4, 1fr)'
		}} gap="6">
			<GridItem colSpan={3}>
				<Suspense fallback={<Loading/>}>
					<WorldMap data={selectedIndices}></WorldMap>
				</Suspense>
			</GridItem>
			<GridItem>
				<IndicesTable {...{data, countries, onCountryChanged}}></IndicesTable>
			</GridItem>
		</Grid>
	)
}

export default IndicesPerformance;
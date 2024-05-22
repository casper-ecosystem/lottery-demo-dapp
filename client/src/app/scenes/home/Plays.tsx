import { PageTile } from '@make-software/cspr-ui';
import styled from 'styled-components';
import NoPlays from './NoPlays';
import Table from '../../components/table/table';
import { useFetch } from '../../services/use-fetch';
import TableLoader from '../../components/table/table-loader';
import PlaysDataHeaders from './PlaysDataHeaders';
import PlaysTableRow from './PlaysTableRow';
import TableTile from '../../components/table-tile/table-tile';
import { useState } from 'react';

const StyledPageTile = styled(PageTile)(() => ({
	padding: '60px 0',
}));

const PlaysTable = () => {
	const [limit, setLimit] = useState(10);
	const {
		data: plays,
		loading,
		total,
	} = useFetch({
		url: '/rounds/latest/plays',
		limit,
	});

	// @ts-ignore
	if (!plays) {
		return (
			<StyledPageTile>
				<NoPlays />
			</StyledPageTile>
		);
	}

	if (loading) {
		return (
			<PageTile>
				<TableLoader columnsLength={1} />
			</PageTile>
		);
	}

	return (
		<Table
			itemCount={total}
			renderHeaders={() => <PlaysDataHeaders />}
			renderData={() =>
				plays.map(play => (
					<PlaysTableRow play={play} key={play.playId} />
				))
			}
		/>
	);
};

const Plays = () => {
	return (
		<TableTile title={'Plays'}>
			<PlaysTable />
		</TableTile>
	);
};

export default Plays;

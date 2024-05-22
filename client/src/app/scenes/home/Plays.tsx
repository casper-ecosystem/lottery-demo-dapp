import { PageTile } from '@make-software/cspr-ui';
import NoPlays from './NoPlays';
import Table from '../../components/table/table';
import { useFetch } from '../../services/use-fetch';
import TableLoader from '../../components/table/table-loader';
import PlaysDataHeaders from './PlaysDataHeaders';
import PlaysTableRow from './PlaysTableRow';
import TableTile from '../../components/table-tile/table-tile';
import { ErrorTile } from '../../components/error-tile/error-tile';

const PlaysTable = () => {
	const {
		data: plays,
		loading,
		error,
		total,
	} = useFetch({
		url: '/rounds/latest/plays',
		limit: 10,
	});

	if (loading) {
		return (
			<PageTile>
				<TableLoader columnsLength={1} />
			</PageTile>
		);
	}

	if (error) {
		return <ErrorTile message={error} />;
	}

	if (!plays || !plays.length) {
		return <NoPlays />;
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

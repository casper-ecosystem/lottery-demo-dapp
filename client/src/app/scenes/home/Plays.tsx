import { PageTile } from '@make-software/cspr-ui';
import { useFetch } from '../../services/use-fetch';
import {
	ErrorTile,
	LoadMoreButton,
	TableLoader,
	TableTile,
	Table,
} from '../../components';
import PlaysDataHeaders from './PlaysDataHeaders';
import PlaysTableRow from './PlaysTableRow';
import NoPlays from './NoPlays';

const PlaysTable = () => {
	const {
		data: plays,
		loading,
		error,
		total,
		loadAllData,
		resetLimit,
	} = useFetch({
		url: '/rounds/latest/plays',
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

	if (!plays || plays.length < 1) {
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
			renderFooterButton={() => (
				<LoadMoreButton
					isCollapsed={plays.length < total}
					handleLoadMore={loadAllData}
					handleReset={resetLimit}
				/>
			)}
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

import { PageTile } from '@make-software/cspr-ui';
import {
	NoData,
	ErrorTile,
	TableTile,
	PageLayout,
	TableLoader,
	Table,
} from '../../components';
import { useFetch } from '../../services/use-fetch';
import JackpotsDataHeaders from './JackpotsDataHeaders';
import JackpotTableRow from './JackpotTableRow';

const JackpotsTable = () => {
	const {
		data: jackpots,
		loading,
		error,
		total,
	} = useFetch({
		url: '/rounds',
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

	if (!jackpots || !jackpots.length) {
		return <NoData />;
	}

	return (
		<Table
			itemCount={total}
			renderHeaders={() => <JackpotsDataHeaders />}
			renderData={() =>
				jackpots.map(round => (
					<JackpotTableRow round={round} key={round.roundId} />
				))
			}
		/>
	);
};

const JackpotsScene = () => {
	return (
		<PageLayout title={'Jackpots'}>
			<TableTile title={'Jackpots'}>
				<JackpotsTable />
			</TableTile>
		</PageLayout>
	);
};

export default JackpotsScene;

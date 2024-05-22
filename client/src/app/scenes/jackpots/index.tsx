import { PageTile, BodyText } from '@make-software/cspr-ui';
import Table from '../../components/table/table';
import { useFetch } from '../../services/use-fetch';
import TableLoader from '../../components/table/table-loader';
import JackpotsDataHeaders from './JackpotsDataHeaders';
import JackpotTableRow from './JackpotTableRow';
import TableTile from '../../components/table-tile/table-tile';
import PageLayout from '../../components/page-layout/page-layout';

const JackpotsTable = () => {
	const {
		data: jackpots,
		loading,
		total,
	} = useFetch({
		url: '/rounds',
		limit: 10,
	});

	if (!jackpots) {
		return <BodyText size={1}>No data</BodyText>;
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

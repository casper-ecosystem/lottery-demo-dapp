import { PageTile } from '@make-software/cspr-ui';
import {
	NoData,
	ErrorTile,
	TableTile,
	PageLayout,
	TableLoader,
	Table,
	LoadMoreButton,
} from '../../components';
import { useGetTableData } from '../../services/hooks/use-get-table-data';
import JackpotsDataHeaders from './JackpotsDataHeaders';
import JackpotTableRow from './JackpotTableRow';

const JackpotsTable = () => {
	const {
		data: jackpots,
		loading,
		error,
		total,
		loadAllData,
		resetLimit,
	} = useGetTableData({
		url: '/rounds',
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

	if (!jackpots || jackpots.length < 1) {
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
			renderFooterButton={() => (
				<LoadMoreButton
					isCollapsed={jackpots.length < total}
					handleLoadMore={loadAllData}
					handleReset={resetLimit}
				/>
			)}
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

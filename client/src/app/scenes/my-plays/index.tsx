import { useClickRef } from '@make-software/csprclick-ui';
import { PageTile } from '@make-software/cspr-ui';
import {
	Table,
	TableLoader,
	TableTile,
	PageLayout,
	NoData,
	ErrorTile,
	LoadMoreButton,
} from '../../components';
import { useGetTableData } from '../../services/hooks/use-get-table-data';
import MyPlaysDataHeaders from './MyPlaysDataHeaders';
import MyPlaysTableRow from './MyPlaysTableRow';

const MyPlaysTable = () => {
	const clickRef = useClickRef();
	const activePublicKey = clickRef?.currentAccount?.public_key || '';

	const {
		data: myPlays,
		loading,
		error,
		total,
		loadAllData,
		resetLimit,
	} = useGetTableData({
		url: `/players/${activePublicKey}/plays`,
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

	if (!myPlays || myPlays.length < 1) {
		return <NoData />;
	}

	return (
		<Table
			itemCount={total}
			renderHeaders={() => <MyPlaysDataHeaders />}
			renderData={() =>
				myPlays.map(play => (
					<MyPlaysTableRow play={play} key={play.roundId} />
				))
			}
			renderFooterButton={() => (
				<LoadMoreButton
					isCollapsed={myPlays.length < total}
					handleLoadMore={loadAllData}
					handleReset={resetLimit}
				/>
			)}
		/>
	);
};

const MyPlaysScene = () => {
	return (
		<PageLayout title={'My plays'}>
			<TableTile title={'My plays'}>
				<MyPlaysTable />
			</TableTile>
		</PageLayout>
	);
};

export default MyPlaysScene;

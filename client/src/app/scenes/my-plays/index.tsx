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
import { Play } from '../../types';
import { PublicKey } from 'casper-js-sdk';
import { useContext } from 'react';
import { ActiveAccountContext } from '../../../App';

const MyPlaysTable = () => {
	const activeAccountContext = useContext(ActiveAccountContext);
	const accountHash = activeAccountContext?.public_key
		? PublicKey.fromHex(activeAccountContext.public_key).accountHash().toHex()
		: null;

	const {
		data: myPlays,
		loading,
		error,
		total,
		loadAllData,
		resetLimit,
	} = useGetTableData<Play[]>({
		url: accountHash ? `/players/${accountHash}/plays` : null,
	});

	if (loading) {
		return <TableLoader columnsLength={1} />;
	}

	if (error) {
		return <ErrorTile message={error} />;
	}

	if (!myPlays || myPlays.length < 1 || !activeAccountContext) {
		return <NoData />;
	}

	return (
		<Table
			itemCount={total}
			renderHeaders={() => <MyPlaysDataHeaders />}
			renderData={() =>
				myPlays.map((play: Play) => (
					<MyPlaysTableRow play={play} key={play.playId} />
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

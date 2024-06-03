import { useClickRef } from '@make-software/csprclick-ui';
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
import { CLPublicKey, encodeBase16 } from 'casper-js-sdk';

const MyPlaysTable = () => {
	const clickRef = useClickRef();
	const activePublicKey = clickRef?.currentAccount?.public_key;
	const accountHash = activePublicKey
		? encodeBase16(
				CLPublicKey.fromHex(activePublicKey).toAccountHash()
		  )
		: null;

	const {
		data: myPlays,
		loading,
		error,
		total,
		loadAllData,
		resetLimit,
	} = useGetTableData<Play[]>({
		url: accountHash ? `/players/${accountHash}/plays` : '',
	});

	if (loading) {
		return <TableLoader columnsLength={1} />;
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

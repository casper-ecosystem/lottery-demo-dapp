import { useClickRef } from '@make-software/csprclick-ui';
import { PageTile } from '@make-software/cspr-ui';
import {
	Table,
	TableLoader,
	TableTile,
	PageLayout,
	NoData,
	ErrorTile,
} from '../../components';
import { useFetch } from '../../services/use-fetch';
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
	} = useFetch({
		url: `/players/${activePublicKey}/plays`,
		limit: 10,
	});

	if (!myPlays || !myPlays.length) {
		return <NoData />;
	}

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

	return (
		<Table
			itemCount={total}
			renderHeaders={() => <MyPlaysDataHeaders />}
			renderData={() =>
				myPlays.map(play => (
					<MyPlaysTableRow play={play} key={play.roundId} />
				))
			}
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

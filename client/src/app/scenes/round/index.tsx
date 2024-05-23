import { useParams } from 'react-router-dom';
import { PageTile } from '@make-software/cspr-ui';
import { useFetch } from '../../services/use-fetch';
import {
	NoData,
	ErrorTile,
	TableTile,
	PageLayout,
	TableLoader,
	Table,
	LoadMoreButton,
} from '../../components';
import PlaysDataHeaders from '../home/PlaysDataHeaders';
import PlaysTableRow from '../home/PlaysTableRow';

const JackpotRoundTable = ({ id }: { id: string }) => {
	const {
		data: plays,
		loading,
		error,
		total,
		loadAllData,
		resetLimit,
	} = useFetch({
		url: `/rounds/${id}/plays`,
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
		return <NoData />;
	}

	return (
		<Table
			itemCount={total}
			renderHeaders={() => <PlaysDataHeaders />}
			renderData={() =>
				plays.map(play => (
					<PlaysTableRow key={play.playId} play={play} />
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

const JackpotRoundScene = () => {
	const urlParams = useParams();
	const jackpotId = urlParams.id || '0';

	return (
		<PageLayout title={`Jackpot #${jackpotId || 0} plays`}>
			<TableTile title={`Jackpot #${jackpotId || 0} plays`}>
				<JackpotRoundTable id={jackpotId} />
			</TableTile>
		</PageLayout>
	);
};

export default JackpotRoundScene;

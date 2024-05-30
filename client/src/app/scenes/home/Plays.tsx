import { PageTile } from '@make-software/cspr-ui';
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
import { Play } from '../../types';
import { usePlaysData } from '../../services/providers/PlaysContext';

interface PlaysTableProps {
	setModalOpen: (isOpen: boolean) => void;
}

const PlaysTable = ({ setModalOpen }: PlaysTableProps) => {
	const { plays, loading, error, total, loadAllData, resetLimit } =
		usePlaysData();

	if (loading) {
		return <TableLoader columnsLength={1} />;
	}

	if (error) {
		return <ErrorTile message={error} />;
	}

	if (!plays || plays.length < 1) {
		return <NoPlays setModalOpen={setModalOpen} />;
	}

	return (
		<Table
			itemCount={total}
			renderHeaders={() => <PlaysDataHeaders />}
			renderData={() =>
				plays.map((play: Play) => (
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

interface PlaysProps {
	setModalOpen: (isOpen: boolean) => void;
}

const Plays = (props: PlaysProps) => {
	return (
		<TableTile title={'Plays'}>
			<PlaysTable {...props} />
		</TableTile>
	);
};

export default Plays;

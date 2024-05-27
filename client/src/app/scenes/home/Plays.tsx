import { PageTile } from '@make-software/cspr-ui';
import { useGetTableData } from '../../services/hooks/use-get-table-data';
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

interface PlaysTableProps {
	setModalOpen: (isOpen: boolean) => void;
}

const PlaysTable = ({ setModalOpen }: PlaysTableProps) => {
	const {
		data: plays,
		loading,
		error,
		total,
		loadAllData,
		resetLimit,
	} = useGetTableData({
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
		return <NoPlays setModalOpen={setModalOpen} />;
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

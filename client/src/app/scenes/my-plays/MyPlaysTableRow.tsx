import { BodyText, TableData, TableRow } from '../../components';
import { HistoryLink, PrizeCell } from '../../components';
import { Play } from '../../types';
import DeployTimestamp from '../../components/timestamp/timestamp';

const MyPlaysTableRow = ({ play }: { play: Play }) => {
	const {
		playId,
		prizeAmount,
		roundId,
		timestamp,
		isJackpot,
		deployHash,
	} = play;

	const roundPath = `/jackpot/${roundId}`;

	return (
		<TableRow key={playId}>
			<TableData>
				<BodyText size={3}>
					<HistoryLink href={roundPath}>Round {roundId}</HistoryLink>
				</BodyText>
			</TableData>
			<PrizeCell amount={prizeAmount} isJackpot={isJackpot} />
			<TableData />
			<TableData>
				<DeployTimestamp
					deployHash={deployHash}
					timestamp={timestamp}
				/>
			</TableData>
		</TableRow>
	);
};

export default MyPlaysTableRow;

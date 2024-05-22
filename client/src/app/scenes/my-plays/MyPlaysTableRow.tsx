import {
	BodyText,
	TableData,
	TableRow,
} from '@make-software/cspr-ui';
import { HistoryLink, PrizeCell } from '../../components';
import { formatIsoTimestamp } from '../../utils/casper-helper';
import { Play } from '../../types';

const MyPlaysTableRow = ({ play }: { play: Play }) => {
	const { playId, prizeAmount, roundId, timestamp } = play;

	const roundPath = `/jackpot/${roundId}`;

	return (
		<TableRow key={playId}>
			<TableData>
				<BodyText size={3}>
					<HistoryLink href={roundPath}>Round {roundId}</HistoryLink>
				</BodyText>
			</TableData>
			<PrizeCell amount={prizeAmount} isJackpot />
			<TableData />
			<TableData>
				<BodyText size={3}>{formatIsoTimestamp(timestamp)}</BodyText>
			</TableData>
		</TableRow>
	);
};

export default MyPlaysTableRow;

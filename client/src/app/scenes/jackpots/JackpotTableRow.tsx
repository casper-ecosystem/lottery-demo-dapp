import {
	BodyText,
	TableData,
	TableRow,
} from '@make-software/cspr-ui';
import {
	AccountInfoCell,
	HistoryLink,
	PrizeCell,
} from '../../components';
import { formatIsoTimestamp } from '../../utils/casper-helper';
import { Round } from '../../types';

const JackpotTableRow = ({ round }: { round: Round }) => {
	const { roundId, winnerPublicKey, jackpotAmount, endedAt } = round;

	const roundPath = `/jackpot/${roundId}`;

	return (
		<TableRow key={roundId}>
			<TableData>
				<BodyText size={3}>
					<HistoryLink href={roundPath}>Round {roundId}</HistoryLink>
				</BodyText>
			</TableData>
			<AccountInfoCell publicKey={winnerPublicKey} />
			<PrizeCell amount={jackpotAmount} isJackpot />
			<TableData />
			<TableData>
				<BodyText size={3}>{formatIsoTimestamp(endedAt)}</BodyText>
			</TableData>
		</TableRow>
	);
};

export default JackpotTableRow;

import {
	BodyText,
	TableData,
	TableRow,
} from '@make-software/cspr-ui';
import {
	AccountInfoCell,
	Link,
	LinkVariation,
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
					<Link to={roundPath} variation={LinkVariation.blue}>
						Round {roundId}
					</Link>
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

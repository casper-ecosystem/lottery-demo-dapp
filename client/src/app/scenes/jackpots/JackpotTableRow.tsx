import { BodyText, TableData, TableRow } from '../../components';
import {
	AccountInfoCell,
	Link,
	LinkVariation,
	PrizeCell,
} from '../../components';
import { Round } from '../../types';
import Timestamp from '../../components/timestamp/timestamp';

const JackpotTableRow = ({ round }: { round: Round }) => {
	const {
		roundId,
		winnerPublicKey,
		jackpotAmount,
		endedAt,
		deployHash,
	} = round;

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
				<Timestamp deployHash={deployHash} timestamp={endedAt} />
			</TableData>
		</TableRow>
	);
};

export default JackpotTableRow;

import {
	BodyText,
	TableData,
	TableRow,
} from '@make-software/cspr-ui';
import { AccountInfoCell, PrizeCell } from '../../components';
import { formatIsoTimestamp } from '../../utils/casper-helper';

interface Play {
	deployHash: string;
	isJackpot: boolean;
	playId: string;
	playerAccountHash: string;
	playerPublicKey: string;
	prizeAmount: string;
	roundId: string;
	timestamp: string;
}

const PlaysTableRow = ({ play }: { play: Play }) => {
	return (
		<TableRow key={play.playId}>
			<AccountInfoCell
				accountHash={play.playerAccountHash}
				publicKey={play.playerPublicKey}
			/>
			<PrizeCell
				amount={play?.prizeAmount}
				isJackpot={play.isJackpot}
			/>
			<TableData />
			<TableData>
				<BodyText size={3}>
					{formatIsoTimestamp(play.timestamp)}
				</BodyText>
			</TableData>
		</TableRow>
	);
};

export default PlaysTableRow;

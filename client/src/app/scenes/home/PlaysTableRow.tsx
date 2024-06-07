import { TableData, TableRow } from '../../components';
import { AccountInfoCell, PrizeCell } from '../../components';
import { Play } from '../../types';
import Timestamp from '../../components/timestamp/timestamp';

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
				<Timestamp
					deployHash={play.deployHash}
					timestamp={play.timestamp}
				/>
			</TableData>
		</TableRow>
	);
};

export default PlaysTableRow;

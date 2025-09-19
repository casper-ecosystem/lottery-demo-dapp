import { TableData, TableRow } from '@make-software/cspr-design';

import { AccountInfoCell, PrizeCell } from '../../components';
import { Play } from '../../types';
import DeployTimestamp from '../../components/timestamp/timestamp';

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
				<DeployTimestamp
					deployHash={play.deployHash}
					timestamp={play.timestamp}
				/>
			</TableData>
		</TableRow>
	);
};

export default PlaysTableRow;

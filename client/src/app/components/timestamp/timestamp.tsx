import { formatTimestamp } from '../../utils/formatters';
import { HistoryLink } from '../history-link/history-link';
import { BodyText } from '../body-text/body-text';

interface TimestampProps {
	deployHash?: string;
	timestamp: string;
}

const Timestamp = ({ deployHash, timestamp }: TimestampProps) => {
	const deployPath = `${config.cspr_live_url}deploy/${
		deployHash || ''
	}`;
	return (
		<HistoryLink href={deployPath} target={'_blank'} monotype>
			<BodyText size={3}>{formatTimestamp(timestamp)}</BodyText>
		</HistoryLink>
	);
};

export default Timestamp;

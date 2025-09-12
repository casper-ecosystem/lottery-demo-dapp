import { formatTimestamp } from '../../utils/formatters';
import { HistoryLink } from '../history-link/history-link';
import { BodyText } from '@make-software/cspr-design';

interface DeployTimestampProps {
	deployHash?: string;
	timestamp: string;
}

const DeployTimestamp = ({
	deployHash,
	timestamp,
}: DeployTimestampProps) => {
	const deployPath = `${config.cspr_live_url}/deploy/${
		deployHash || ''
	}`;
	return (
		<HistoryLink href={deployPath} target={'_blank'} monotype>
			<BodyText size={3}>{formatTimestamp(timestamp)}</BodyText>
		</HistoryLink>
	);
};

export default DeployTimestamp;

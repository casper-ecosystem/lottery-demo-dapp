import styled from 'styled-components';
import TableRow from './table-row';
import StyledIdenticon from './StyledIdenticon';
import { truncateHash } from '../../../../../casper-helper';
import trophy from '../../../../../images/icons/trophy-bold.svg';
import { motesToCSPR } from 'casper-js-sdk';

const StyledTableData = styled.td(({ theme }) =>
	theme.withMedia({
		height: 48,
		padding: 8,
		textAlign: 'left',
		':first-of-type': {
			paddingLeft: 20,
		},
		':last-of-type': {
			paddingRight: 20,
		},
	})
);

const StyledIdentifier = styled.div(({ theme }) =>
	theme.withMedia({
		display: 'flex',
		alignItems: 'center',
		span: {
			marginLeft: '10px',
		},
	})
);

const StyledAccountHash = styled.a(({ theme }) =>
	theme.withMedia({
		fontFamily: '"JetBrains Mono", serif',
		color: `${theme.fillPrimaryBlue} !important`,
	})
);

interface PlaysTableDataProps {
	accountHash: string;
	prize: string;
	timestamp: string;
	isJackpot: boolean;
}

export default function PlaysTableData(props: PlaysTableDataProps) {
	return (
		<>
			<TableRow>
				<StyledTableData>
					<StyledIdentifier>
						<StyledIdenticon size={32} string={props.accountHash} />
						<span>
							{props.isJackpot && <img src={trophy} />}
							<StyledAccountHash href={`https://testnet.cspr.live/account/${props.accountHash}`} target='_blank'>
								{truncateHash(props.accountHash)}
							</StyledAccountHash>
						</span>
					</StyledIdentifier>
				</StyledTableData>
				<StyledTableData>{motesToCSPR(props.prize).toString()} CSPR</StyledTableData>
				<StyledTableData>{props.timestamp}</StyledTableData>
			</TableRow>
		</>
	);
}

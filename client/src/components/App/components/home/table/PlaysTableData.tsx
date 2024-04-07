import styled from 'styled-components';
import TableRow from './table-row';
import StyledIdenticon from './StyledIdenticon';
import { truncateHash } from '../../../../../casper-helper';
import trophy from '../../../../../images/icons/trophy-bold.svg';
import { motesToCSPR } from 'casper-js-sdk';

const StyledTableData = styled.td(({ theme }) =>
	theme.withMedia({
    fontSize: 14,
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

const DeployLink = styled.a(({ theme }) =>
  theme.withMedia({
    color: `${theme.fillPrimaryBlue} !important`,
  })
);

const PrizeContainer = styled.div(({ theme }) =>
  theme.withMedia({
    display: 'flex',
    alignItems: 'center'
  })
);

interface PlaysTableDataProps {
	accountHash: string;
	prize: string;
	timestamp: string;
	isJackpot: boolean;
  deployHash: string;
}

export default function PlaysTableData(props: PlaysTableDataProps) {
	return (
		<>
			<TableRow>
				<StyledTableData>
					<StyledIdentifier>
						<StyledIdenticon size={24} string={props.accountHash} />&nbsp;
            <StyledAccountHash href={`https://testnet.cspr.live/account/${props.accountHash}`} target='_blank'>
              {truncateHash(props.accountHash)}
            </StyledAccountHash>
					</StyledIdentifier>
				</StyledTableData>
				<StyledTableData>
          <PrizeContainer>
            {motesToCSPR(props.prize).toString()} CSPR&nbsp;
            {props.isJackpot && <img src={trophy} width={32} />}
          </PrizeContainer>
        </StyledTableData>
				<StyledTableData>
          <DeployLink href={`https://testnet.cspr.live/deploy/${props.deployHash}`} target='_blank'>
            {(new Date(props.timestamp)).toUTCString()}
          </DeployLink>
        </StyledTableData>
			</TableRow>
		</>
	);
}

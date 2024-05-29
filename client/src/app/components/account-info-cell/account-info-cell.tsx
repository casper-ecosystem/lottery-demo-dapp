import styled from 'styled-components';
import { AccountIdenticon } from '@make-software/csprclick-ui';
import {
	BodyText,
	formatHash,
	HashLength,
	TableData,
	FlexRow,
} from '@make-software/cspr-ui';
import { HistoryLink } from '../history-link/history-link';

export const StyledTableData = styled(TableData)(({ theme }) => ({
	padding: '12px 8px',
}));

interface AccountInfoCellProps {
	accountHash?: string;
	publicKey: string;
}

export const AccountInfoCell = ({
	publicKey,
	accountHash,
}: AccountInfoCellProps) => {
	const hash = publicKey || accountHash || '';
	const accountPath = `${config.cspr_live_url}/account/${hash}`;

	return (
		<StyledTableData>
			<FlexRow align='center' itemsSpacing={12}>
				<AccountIdenticon hex={hash} size='m' />
				<BodyText variation='darkGray' size={3} scale={'sm'}>
					<HistoryLink href={accountPath} target={'_blank'} monotype>
						{formatHash(hash, HashLength.TINY)}
					</HistoryLink>
				</BodyText>
			</FlexRow>
		</StyledTableData>
	);
};

export default AccountInfoCell;

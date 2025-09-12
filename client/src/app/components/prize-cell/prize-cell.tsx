import styled from 'styled-components';
import {
	BodyText,
	FlexRow,
	SvgIcon,
	TableData,
} from '@make-software/cspr-design';
import CupIcon from '../../../assets/icons/cup.svg';
import { formatNumber } from '../../utils/formatters';
import { motesToCSPR } from '../../utils/currency';
import { SMALL_PRECISION } from '../../utils/constants';

const StyledSvgIcon = styled(SvgIcon)(({ theme }) => ({
	marginLeft: 10,
	path: {
		fill: theme.styleguideColors.contentLightBlue,
	},
}));

interface PrizeCellProps {
	isJackpot: boolean;
	amount?: string;
}

export const PrizeCell = ({ amount, isJackpot }: PrizeCellProps) => {
	const prizeAmount = formatNumber(motesToCSPR(amount || '0'), {
		precision: SMALL_PRECISION,
	});
	return (
		<TableData align='right'>
			<FlexRow align={'center'} justify={'flex-end'}>
				<BodyText size={3}>{prizeAmount} CSPR</BodyText>
				{isJackpot && (
					<StyledSvgIcon src={CupIcon} width={16} height={16} />
				)}
			</FlexRow>
		</TableData>
	);
};

export default PrizeCell;

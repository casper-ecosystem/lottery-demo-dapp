import styled from 'styled-components';
import {
	BodyText,
	FlexRow,
	formatNumber,
	SMALL_PRECISION,
	SvgIcon,
	TableData,
} from '@make-software/cspr-ui';
import { motesToCSPR } from '@make-software/cspr-ui/dist/lib/utils/currency';
import CupIcon from '../../../assets/icons/cup.svg';

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

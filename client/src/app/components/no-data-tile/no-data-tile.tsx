import styled from 'styled-components';
import {
	FlexColumn,
	FlexRow,
	HeaderText,
} from '@make-software/cspr-ui';

const StyledFlexColumn = styled(FlexColumn)(() => ({
	width: '400px',
	height: '400px',
}));

export const NoData = () => {
	return (
		<FlexRow align={'center'} justify={'center'}>
			<StyledFlexColumn
				itemsSpacing={24}
				align={'center'}
				justify={'center'}
			>
				<FlexColumn
					itemsSpacing={16}
					align={'center'}
					justify={'center'}
				>
					<HeaderText size={3} scale={'xs'} variation={'black'}>
						No data
					</HeaderText>
				</FlexColumn>
			</StyledFlexColumn>
		</FlexRow>
	);
};

import styled from 'styled-components';
import {
	BodyText,
	FlexColumn,
	FlexRow,
	HeaderText,
} from '../../components';
import { AxiosError } from 'axios';

const StyledFlexColumn = styled(FlexColumn)(() => ({
	width: '400px',
	height: '400px',
}));

interface ErrorTileProps {
	message: AxiosError<string>;
}

export const ErrorTile = ({ message }: ErrorTileProps) => {
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
						Error
					</HeaderText>
					<BodyText size={3} scale={'sm'} variation={'red'}>
						{message.message}
					</BodyText>
				</FlexColumn>
			</StyledFlexColumn>
		</FlexRow>
	);
};

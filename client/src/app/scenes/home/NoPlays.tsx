import styled from 'styled-components';
import {
	BodyText,
	Button,
	FlexColumn,
	FlexRow,
	HeaderText,
	PageTile,
} from '@make-software/cspr-ui';
// @ts-ignore
import CupIcon from '../../../assets/icons/cup.svg';
import { Icon } from '../../components';

const StyledPageTile = styled(PageTile)(() => ({
	padding: '60px 0',
	boxShadow: 'none',
}));

const StyledFlexColumn = styled(FlexColumn)(() => ({
	width: '400px',
}));

const StyledBodyText = styled(BodyText)(({ theme }) => ({
	textAlign: 'center',
}));

interface NoPlaysProps {
	setModalOpen: (isOpen: boolean) => void;
}

const NoPlays = ({ setModalOpen }: NoPlaysProps) => {
	const handlePlay = () => {
		setModalOpen(true);
	};

	return (
		<StyledPageTile>
			<FlexRow align={'center'} justify={'center'}>
				<StyledFlexColumn
					itemsSpacing={24}
					align={'center'}
					justify={'center'}
				>
					<Icon src={CupIcon} />
					<FlexColumn
						itemsSpacing={16}
						align={'center'}
						justify={'center'}
					>
						<HeaderText size={3} scale={'xs'} variation={'black'}>
							No plays yet
						</HeaderText>
						<StyledBodyText
							size={3}
							scale={'sm'}
							variation={'darkGray'}
						>
							Purchase your ticket now to stand a chance of seeing
							your name on this list of winners.
						</StyledBodyText>
					</FlexColumn>
					<Button color={'primaryBlue'} onClick={handlePlay}>
						Play
					</Button>
				</StyledFlexColumn>
			</FlexRow>
		</StyledPageTile>
	);
};

export default NoPlays;

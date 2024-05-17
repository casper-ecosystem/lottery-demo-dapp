import {
	FlexColumn,
	HeaderText,
	PageTile,
} from '@make-software/cspr-ui';
// @ts-ignore
import CupIcon from '../../../assets/icons/cup.svg';
import styled from 'styled-components';
import NoPlays from './NoPlays';

const PlaysHeaderText = styled(HeaderText)(() => ({
	marginTop: '60px',
}));

const StyledPageTile = styled(PageTile)(() => ({
	padding: '60px 0',
}));

const Plays = () => {
	return (
		<FlexColumn itemsSpacing={24}>
			<PlaysHeaderText size={4} scale={'sm'}>
				Plays
			</PlaysHeaderText>
			<StyledPageTile>
				<NoPlays />
			</StyledPageTile>
		</FlexColumn>
	);
};

export default Plays;

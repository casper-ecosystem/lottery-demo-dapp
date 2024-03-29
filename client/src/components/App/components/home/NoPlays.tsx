import styled from 'styled-components';
import trophy from '../../../../images/icons/trophy-bold.svg';
import { IconContainer } from '../../../../globalStyles';
import { SetModalInViewProps } from './Home';

const NoPlaysStyled = styled.div(({ theme }) =>
	theme.withMedia({
		width: '50%',
		margin: 'auto',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		'h4, p': {
			textAlign: 'center',
		},
		h4: {
			color: theme.contentPrimary,
			fontSize: '24px',
			marginBlock: '1em',
		},
	})
);

const PlayButton = styled.button(({ theme }) =>
	theme.withMedia({
		backgroundColor: theme.fillPrimaryBlue + '!important',
		border: 'none',
		width: '100%',
		borderRadius: '4px',
		cursor: 'pointer',
	})
);

export default function NoPlays(props: SetModalInViewProps) {
	function handlePlayNow() {
		props.setModalInView(true);
	}

	return (
		<NoPlaysStyled>
			<IconContainer>
				<img src={trophy} />
			</IconContainer>
			<h4>No plays yet</h4>
			<p>Purchase your ticket now to stand a chance of seeing your name on this list of winners.</p>
			<PlayButton onClick={handlePlayNow}>Play</PlayButton>
		</NoPlaysStyled>
	);
}

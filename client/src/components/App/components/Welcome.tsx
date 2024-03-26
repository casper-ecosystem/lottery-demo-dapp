import styled from 'styled-components';
import desktopBgImage from '../../../images/desktop-bg.svg';
import jackpotImage from '../../../images/jackpot-text.svg';
import jackpotFlare from '../../../images/jackpot-flare.svg';
import { useState } from 'react';
import Modal from './Modal';
import { SetModalInViewProps } from '../../../App';

const Container = styled.div(({ theme }) =>
	theme.withMedia({
		backgroundColor: '#0F1429',
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'right',
		height: ['693px', '624px', '624px'],
		width: '100%',
		overflowX: 'hidden',
	})
);

const ContentWrapper = styled.div(({ theme }) =>
	theme.withMedia({
		height: ['653px', '584px', '584px'],
		margin: '0 auto',
		width: ['516px', '696px', '936px'],
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	})
);

const IntroductoryContent = styled.div(({ theme }) =>
	theme.withMedia({
		zIndex: 1,
	})
);

const GreetingText = styled.div(({ theme }) =>
	theme.withMedia({
		color: '#DADCE5',
		fontSize: ['24px', '40px', '40px'],
		fontWeight: '600',
		lineHeight: ['32px', '56px', '56px'],
	})
);

const Description = styled.div(({ theme }) =>
	theme.withMedia({
		color: '#A8ADBF',
		fontSize: '16px',
		fontWeight: '200',
		lineHeight: '24px',
		marginTop: '8px',
		width: ['81%', '100%', '100%'],
	})
);

const ShotWrapper = styled.div(({ theme }) =>
	theme.withMedia({
		marginTop: '1rem',
	})
);

const ShotCost = styled.p(({ theme }) =>
	theme.withMedia({
		padding: '4px 12px',
		borderRadius: '22px',
		backgroundColor: '#181D40',
		color: '#7490FF',
		fontWeight: '300',
		fontSize: '14px',
		display: 'inline',
	})
);

const PlayNowButton = styled.div(({ theme }) =>
	theme.withMedia({
		display: 'flex',
		justifyContent: 'center',
		alignItem: 'center',
		width: '240px',
		height: '36px',
		padding: '8px 16px',
		borderRadius: '4px',
		backgroundColor: '#B2332D',
		fontSize: '14px',
		lineHeight: '20px',
		color: '#F2F2F2',
		marginTop: '32px',

		'&:hover': {
			cursor: 'pointer',
			backgroundColor: '#9f211c',
		},
	})
);

const JackpotContainer = styled.div(({ theme }) =>
	theme.withMedia({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: '240px',
		position: 'relative',
	})
);

const JackpotFlare = styled.img(({ theme }) =>
	theme.withMedia({
		position: 'absolute',
		top: '0',
		left: '0',
		transform: 'translate(-55%, -35%)',
	})
);

const JackpotImageText = styled.img`
	width: 240px;
`;

const JackpotText = styled.div(({ theme }) =>
	theme.withMedia({
		'h2, h3': {
			display: 'inline',
			background: '-webkit-linear-gradient(#ffffff, #b4c3ed)',
			WebkitBackgroundClip: 'text',
			WebkitTextFillColor: 'transparent',
			filter: 'drop-shadow(0px 6px 0px #0a2ebf)',
		},
		h2: {
			fontSize: '48px !important',
		},
		h3: {
			fontSize: '36px !important',
		},
	})
);

const CurrentPlays = styled.div(({ theme }) =>
	theme.withMedia({
		marginTop: '1em',
		p: {
			padding: '6px 22px',
			borderRadius: '22px',
			backgroundColor: '#181d40',
			color: '#7490ff',
			fontWeight: '400',
			fontSize: '14px',
			display: 'inline',
		},
	})
);

export const Welcome = (props: SetModalInViewProps) => {
	const handlePlayNow = () => {
		props.setModalInView(true);
	};

	return (
		<>
			<Container>
				<ContentWrapper>
					<IntroductoryContent>
						<GreetingText>Your Chance to Win Big!</GreetingText>
						<Description>
							Don&apos;t miss out on your shot at winning exciting prizes - take
							<br />
							part in the lottery now and let luck be on your side!
						</Description>
						<ShotWrapper>
							<ShotCost>1 shot = 5 CSPR</ShotCost>
						</ShotWrapper>
						<PlayNowButton onClick={handlePlayNow}>Play Now</PlayNowButton>
					</IntroductoryContent>
					<JackpotContainer>
						<JackpotFlare src={jackpotFlare} />
						<JackpotImageText src={jackpotImage} />
						<JackpotText>
							<h2>1,027.44</h2>
							&nbsp;
							<h3>CSPR</h3>
						</JackpotText>
						<CurrentPlays>
							<p>Current Plays: 234</p>
						</CurrentPlays>
					</JackpotContainer>
				</ContentWrapper>
			</Container>
		</>
	);
};

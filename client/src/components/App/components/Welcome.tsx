import styled from 'styled-components';
import desktopBgImage from '../../../images/desktop-bg.svg';
import jackpotImage from '../../../images/jackpot-text.svg';
import { useState } from 'react';
import Modal from './Modal';
import { SetModalInViewProps } from '../../../App';

const Container = styled.div(({ theme }) =>
	theme.withMedia({
		backgroundColor: '#0F1429',
		backgroundImage: [`url("${desktopBgImage}")`],
		backgroundRepeat: 'no-repeat',
		backgroundSize: 'cover',
		backgroundPosition: 'right',
		height: ['693px', '624px', '624px'],
		width: '100%',
	})
);

const ContentWrapper = styled.div(({ theme }) =>
	theme.withMedia({
		display: 'flex',
		position: 'relative',
		top: '50%',
		left: '10%',
		transform: 'translateY(-50%)',
		width: '50%',
	})
);

const IntroductoryContent = styled.div(({ theme }) => theme.withMedia({}));

const GreetingText = styled.div(({ theme }) =>
	theme.withMedia({
		color: '#DADCE5',
		fontSize: ['24px', '40px', '40px'],
		fontWeight: '600',
		lineHeight: ['32px', '56px', '56px'],
		marginTop: ['24px', '40px', '40px'],
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
		width: '176px',
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
		position: 'absolute',
		right: '400px',
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		width: '240px',
	})
);

const JackpotImageText = styled.img`
	width: 240px;
`;

const JackpotText = styled.div`
	h2,
	h3 {
		display: inline;
		background: -webkit-linear-gradient(#ffffff, #b4c3ed);
		-webkit-background-clip: text;
		-webkit-text-fill-color: transparent;
		filter: drop-shadow(0px 6px 0px #0a2ebf);
	}

	h2 {
		font-size: 48px !important;
	}
	h3 {
		font-size: 36px !important;
	}
`;

const CurrentPlays = styled.div`
	margin-top: 1em;
	p {
		padding: 6px 22px;
		border-radius: 22px;
		background-color: #181d40;
		color: #7490ff;
		font-weight: 400;
		font-size: 14px;
		display: inline;
	}
`;

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
				</ContentWrapper>
				<JackpotContainer>
					<JackpotImageText src={jackpotImage}></JackpotImageText>
					<JackpotText>
						<h2>8924.39</h2>
						&nbsp;
						<h3>CSPR</h3>
					</JackpotText>
					<CurrentPlays>
						<p>Current Plays: 234</p>
					</CurrentPlays>
				</JackpotContainer>
			</Container>
		</>
	);
};

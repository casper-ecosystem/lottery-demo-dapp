import styled from 'styled-components';
import welcomeHand from '../../../../images/icons/welcome-hand.svg';
import twoCoins from '../../../../images/icons/two-coins.svg';
import ticket from '../../../../images/icons/ticket.svg';
import disconnectedPlug from '../../../../images/icons/disconnected-plug.svg';
import loading from '../../../../images/loading.svg';
import sad from '../../../../images/icons/sad.svg';
import happy from '../../../../images/icons/happy.svg';
import jackpotTrophy from '../../../../images/icons/jackpot-trophy.svg';
import { IconContainer } from '../../../../globalStyles';
import { csprToMotes } from 'casper-js-sdk';
import { AccountType } from '@make-software/csprclick-core-types';
import { Play } from '../../../../play.interface';
import { DeployFailed, ONE_CSPR } from '../../../../casper-helper';

const StyledModalContentContainer = styled.div(({ theme }) =>
	theme.withMedia({
		width: '100%',
		height: '100%',
		position: 'relative',
		h3: {
			marginBlock: '1em',
			fontWeight: 700,
		},
		'h3, p': {
			textAlign: 'center',
		},
	})
);

const StyledModalLoadingContent = styled.div(({ theme }) =>
	theme.withMedia({
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		height: '100%',
		justifyContent: 'space-around',
		img: {
			height: 60,
			width: 60,
		},
	})
);

interface ExtendedIconContainerProps {
	backgroundColor: string;
}

const ExtendedIconContainer = styled(IconContainer)(({ theme }) =>
	theme.withMedia({
		margin: 'auto',
	})
);

const StyledButton = styled.button(({ theme }) =>
	theme.withMedia({
		border: 'none',
		borderRadius: '4px',
		backgroundColor: theme.fillPrimaryBlue + '!important',
		justifySelf: 'end',
		width: '100%',
		position: 'absolute',
		bottom: 0,
		cursor: 'pointer',
	})
);

interface ModalContentProps {
	connectWallet: () => void;
	linkToFaucet: () => void;
	initiatePlay: () => void;
	clientErrorOccurred: boolean;
	awaitingPlayResult: boolean;
	activeAccountWithBalance: AccountType | null;
	playResult: Play | DeployFailed | null;
}

export default function ModalContent(props: ModalContentProps) {
	let ActionButton = <StyledButton onClick={props.connectWallet}>Connect Wallet</StyledButton>;
	let Icon = (
		<ExtendedIconContainer>
			<img src={welcomeHand} />
		</ExtendedIconContainer>
	);
	let MainText = <h3>Welcome!</h3>;
	let SubText = <p>Please connect your Casper account to play</p>;

	if (props.clientErrorOccurred) {
		ActionButton = (
			<StyledButton
				onClick={() => {
					window.location.reload();
				}}
			>
				Refresh
			</StyledButton>
		);
		Icon = (
			<ExtendedIconContainer>
				<img src={disconnectedPlug} />
			</ExtendedIconContainer>
		);
		MainText = <h3>Something went wrong</h3>;
		SubText = <p>Please refresh the page.</p>;
	} else if (props.playResult == DeployFailed.Failed) {
		ActionButton = <StyledButton onClick={props.initiatePlay}>Play</StyledButton>;
		Icon = (
			<ExtendedIconContainer backgroundColor='#FCEBEA'>
				<img src={disconnectedPlug} />
			</ExtendedIconContainer>
		);
		MainText = <h3>Deploy Failed</h3>;
		SubText = <p>Please try again.</p>;
	} else if (props.playResult !== null) {
		let actionButtonText = 'Play More';
		let mainText = '';
		let subText = '';
		const prize = parseInt(props.playResult.prizeAmount);
		let imgSrc;
		let backgroundColor = '#FCEBEA';
		if (prize == 0) {
			actionButtonText = 'Try Again';
			mainText = 'Unlucky this Time';
			subText = 'You did not win this time. Try again!';
			imgSrc = sad;
		} else if (props.playResult.isJackpot) {
			mainText = 'Jackpot!';
			subText = `Congratulations, you have won the jackpot of ${prize / ONE_CSPR} CSPR!`;
			imgSrc = jackpotTrophy;
			backgroundColor = '#E0FAEF';
		} else if (!props.playResult.isJackpot) {
			mainText = 'You Won!';
			subText = `Congratulations, you have won ${prize / ONE_CSPR} CSPR!`;
			imgSrc = happy;
			backgroundColor = '#E0FAEF';
		}
		ActionButton = <StyledButton onClick={props.initiatePlay}>{actionButtonText}</StyledButton>;
		Icon = (
			<ExtendedIconContainer backgroundColor={backgroundColor}>
				<img src={imgSrc} />
			</ExtendedIconContainer>
		);
		MainText = <h3>{mainText}</h3>;
		SubText = <p>{subText}</p>;
	} else if (
		props.activeAccountWithBalance != null &&
		(props.activeAccountWithBalance.balance == null ||
			parseInt(props.activeAccountWithBalance.balance) < csprToMotes(5).toNumber())
	) {
		ActionButton = <StyledButton onClick={props.linkToFaucet}>Request tokens</StyledButton>;
		Icon = (
			<ExtendedIconContainer>
				<img src={twoCoins} />
			</ExtendedIconContainer>
		);
		MainText = <h3>Not enough CSPR</h3>;
		SubText = <p>You don&apos;t have enough CSPR to buy a ticket. Top up your account!</p>;
	} else if (props.activeAccountWithBalance != null) {
		ActionButton = <StyledButton onClick={props.initiatePlay}>Play</StyledButton>;
		Icon = (
			<ExtendedIconContainer>
				<img src={ticket} />
			</ExtendedIconContainer>
		);
		MainText = <h3>Buy a ticket</h3>;
		SubText = <p>Buy a ticket for your chance to win the jackpot!</p>;
	}

	let modalContent = (
		<>
			{Icon}
			{MainText}
			{SubText}
			{ActionButton}
		</>
	);

	if (props.awaitingPlayResult && !props.clientErrorOccurred) {
		modalContent = (
			<StyledModalLoadingContent>
				<img src={loading} />
				<h3>Waiting for the results of your play...</h3>
			</StyledModalLoadingContent>
		);
	}
	return <StyledModalContentContainer>{modalContent}</StyledModalContentContainer>;
}

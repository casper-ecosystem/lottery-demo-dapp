import React, { useEffect } from 'react';
import styled from 'styled-components';
import { IconContainer } from '../../../../globalStyles';
import xButton from '../../../../images/x-button.svg';
import welcomeHand from '../../../../images/icons/welcome-hand.svg';
import twoCoins from '../../../../images/icons/two-coins.svg';
import ticket from '../../../../images/icons/ticket.svg';
import disconnectedPlug from '../../../../images/icons/disconnected-plug.svg';
import loading from '../../../../images/loading.svg';
import { useClickRef } from '@make-software/csprclick-ui';
import { ActiveAccountContext } from '../../../../App';
import { AccountType } from '@make-software/csprclick-core-types';
import { CLPublicKey, csprToMotes, motesToCSPR } from 'casper-js-sdk';
import { initiateDeployListener, preparePlayDeploy, signAndSendDeploy } from '../../../../casper-helper';
import { useWebSocketDeployData, DeployMessage } from '../../../WebSocketProvider';

const StyledOverlay = styled.div(({ theme }) =>
	theme.withMedia({
		backgroundColor: '#161A33CC',
		position: 'fixed',
		top: '0',
		left: '0',
		right: '0',
		bottom: '0',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		zIndex: '2',
	})
);

const StyledModal = styled.div(({ theme }) =>
	theme.withMedia({
		backgroundColor: '#FFFFFF',
		boxShadow: '0px 16px 48px 0px #1A191933',
		width: ['80%', '40%', '30%'],
		aspectRatio: ['1/1', '1/1'],
		borderRadius: '12px',
		padding: '60px 40px 40px 40px',
		position: 'relative',
	})
);

const StyledxButton = styled.img(({ theme }) =>
	theme.withMedia({
		position: 'absolute',
		top: '30px',
		right: '30px',
		cursor: 'pointer',
	})
);

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

const ExtendedIconContainer = styled(IconContainer)`
	${({ theme }) => `
    margin: auto;
  `}
`;

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

interface ModalProps {
	modalInView: boolean;
	setModalInView: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Modal(props: ModalProps) {
	const activeAccountContext = React.useContext(ActiveAccountContext);
	const clickRef = useClickRef();
	const [activeAccountWithBalance, setActiveAccountWithBalance] = React.useState<AccountType | null>(null);
	const [errorOccurred, setErrorOccurred] = React.useState<boolean>(false);
	const [awaitingPlayResult, setAwaitingPlayResult] = React.useState<boolean>(false);
	const { deploy } = useWebSocketDeployData();
	function disableModal() {
		props.setModalInView(false);
	}

	const handleModalClick = (event: React.MouseEvent) => {
		event.stopPropagation();
	};

	useEffect(() => {
		// Disable Scrolling
		if (props.modalInView) {
			const originalStyle = window.getComputedStyle(document.body).overflow;
			document.body.style.overflow = 'hidden';

			return (): void => {
				document.body.style.overflow = originalStyle;
			};
		}
	}, [props.modalInView]);

	useEffect(() => {
		clickRef?.getActiveAccountWithBalance()?.then(activeAccountWithBalanceReturned => {
			setActiveAccountWithBalance(activeAccountWithBalanceReturned);
		});
	}, [activeAccountContext]);

	useEffect(() => {
		if (deploy !== null) {
			handleDeployProcessed(deploy);
		}
	}, [deploy]);

	if (!props.modalInView) {
		return null;
	}

	async function connectWallet() {
		console.log(await clickRef?.signIn());
	}

	function linkToFaucet() {
		window.open('https://testnet.cspr.live/tools/faucet', '_blank');
	}

	async function initiatePlay() {
		if (activeAccountWithBalance?.public_key == null) {
			setErrorOccurred(true);
			return;
		}
		const publicKey = CLPublicKey.fromHex(activeAccountWithBalance.public_key);
		const deploy = await preparePlayDeploy(publicKey);
		setAwaitingPlayResult(true);
		initiateDeployListener(publicKey);
		signAndSendDeploy(deploy, publicKey);
	}

	function handleDeployProcessed(deploy: DeployMessage) {
		setAwaitingPlayResult(false);
		if (deploy.detected_deploy.error === null) {
			console.log('No error');
		}
	}

	let ActionButton = <StyledButton onClick={connectWallet}>Connect Wallet</StyledButton>;
	let Icon = <img src={welcomeHand} />;
	let MainText = <h3>Welcome!</h3>;
	let SubText = <p>Please connect your Casper account to play</p>;

	if (errorOccurred) {
		ActionButton = (
			<StyledButton
				onClick={() => {
					window.location.reload();
				}}
			>
				Refresh
			</StyledButton>
		);
		Icon = <img src={disconnectedPlug} />;
		MainText = <h3>Something went wrong</h3>;
		SubText = <p>Please refresh the page.</p>;
	} else if (
		activeAccountWithBalance != null &&
		(activeAccountWithBalance.balance == null || parseInt(activeAccountWithBalance.balance) < csprToMotes(5).toNumber())
	) {
		ActionButton = <StyledButton onClick={linkToFaucet}>Request tokens</StyledButton>;
		Icon = <img src={twoCoins} />;
		MainText = <h3>Not enough CSPR</h3>;
		SubText = <p>You don&apos;t have enough CSPR to buy a ticket. Top up your account!</p>;
	} else if (activeAccountWithBalance != null) {
		ActionButton = <StyledButton onClick={initiatePlay}>Play</StyledButton>;
		Icon = <img src={ticket} />;
		MainText = <h3>Buy a ticket</h3>;
		SubText = <p>Buy a ticket for your chance to win the jackpot!</p>;
	}

	let modalContent = (
		<>
			<ExtendedIconContainer>{Icon}</ExtendedIconContainer>
			{MainText}
			{SubText}
			{ActionButton}
		</>
	);

	if (awaitingPlayResult) {
		modalContent = (
			<StyledModalLoadingContent>
				<img src={loading} />
				<h3>Waiting for the results of your play...</h3>
			</StyledModalLoadingContent>
		);
	}

	return (
		<StyledOverlay onClick={disableModal}>
			<StyledModal onClick={handleModalClick}>
				<StyledxButton src={xButton} onClick={disableModal}></StyledxButton>
				<StyledModalContentContainer>{modalContent}</StyledModalContentContainer>
			</StyledModal>
		</StyledOverlay>
	);
}

import React, { useContext, useEffect, useState } from 'react';
import styled, { useTheme } from 'styled-components';
import ReactModal from 'react-modal';
import { useClickRef } from '@make-software/csprclick-ui';
import { AccountType } from '@make-software/csprclick-core-types';
import { CLPublicKey, csprToMotes } from 'casper-js-sdk';
import { FlexColumn } from '@make-software/cspr-ui';

import {
	getPlayByDeployHash,
	initiateDeployListener,
	preparePlayDeploy,
	signAndSendDeploy,
	DeployFailed,
} from '../../utils/casper-helper';
import {
	useWebSocketDeployData,
	DeployMessage,
} from '../../services/WebSocketProvider';

import { Play } from '../../types';
import {
	DeployFailedContent,
	JackpotContent,
	NotEnoughCsprContent,
	SomethingWentWrongContent,
	UnluckyContent,
	WelcomeModalContent,
	YouWonContent,
	BuyTicketContent,
	LoadingContent,
} from '../../components';
import { ActiveAccountContext } from '../../../App';

const modalStyles = {
	left: '50%',
	right: 'auto',
	bottom: 'auto',
	border: 'none',
	borderRadius: '12px',
	padding: '32px 24px 24px 24px',
	top: '50%',
	transform: 'translate(-50%, -50%)',
};

const ModalContainer = styled(FlexColumn)(({ theme }) =>
	theme.withMedia({
		width: ['300px', '400px', '400px', '496px'],
		height: ['400px', '380px', '380px', '456px'],
		background: theme.styleguideColors.backgroundPrimary,
		borderColor: theme.styleguideColors.backgroundPrimary,
	})
);

interface ModalContentProps {
	connectWallet: () => void;
	initiatePlay: () => void;
	clientErrorOccurred: boolean;
	awaitingPlayResult: boolean;
	activeAccountWithBalance: AccountType | null;
	playResult: Play | DeployFailed | null;
	closeModal: () => void;
}

const ModalContent = (props: ModalContentProps) => {
	const {
		connectWallet,
		initiatePlay,
		clientErrorOccurred,
		awaitingPlayResult,
		activeAccountWithBalance,
		playResult,
		closeModal,
	} = props;

	const refreshPage = () => window.location.reload();
	const goToFaucet = () => {
		window.open('https://testnet.cspr.live/tools/faucet', '_blank');
	};

	if (clientErrorOccurred) {
		return (
			<SomethingWentWrongContent
				handleButtonAction={refreshPage}
				closeModal={closeModal}
			/>
		);
	} else if (playResult == DeployFailed.Failed) {
		return (
			<DeployFailedContent
				handleButtonAction={initiatePlay}
				closeModal={closeModal}
			/>
		);
	} else if (playResult !== null) {
		const prize = playResult.prizeAmount;

		if (!prize) {
			return (
				<UnluckyContent
					handleButtonAction={initiatePlay}
					closeModal={closeModal}
				/>
			);
		} else if (playResult.isJackpot) {
			return (
				<JackpotContent
					handleButtonAction={initiatePlay}
					closeModal={closeModal}
				/>
			);
		} else if (!playResult.isJackpot) {
			return (
				<YouWonContent
					handleButtonAction={initiatePlay}
					closeModal={closeModal}
				/>
			);
		}
	} else if (
		activeAccountWithBalance != null &&
		(activeAccountWithBalance.balance == null ||
			parseInt(activeAccountWithBalance.balance) <
				csprToMotes(5).toNumber())
	) {
		return (
			<NotEnoughCsprContent
				handleButtonAction={goToFaucet}
				closeModal={closeModal}
			/>
		);
	} else if (activeAccountWithBalance != null) {
		return (
			<BuyTicketContent
				handleButtonAction={initiatePlay}
				closeModal={closeModal}
			/>
		);
	}

	if (awaitingPlayResult && !clientErrorOccurred) {
		return <LoadingContent closeModal={closeModal} />;
	}
	return (
		<WelcomeModalContent
			handleButtonAction={connectWallet}
			closeModal={closeModal}
		/>
	);
};

export interface ModalProps {
	isOpen: boolean;
	setModalOpen: (isOpen: boolean) => void;
}

export const Modal = ({ isOpen, setModalOpen }: ModalProps) => {
	const theme = useTheme();

	const clickRef = useClickRef();
	const activeAccountContext = useContext(ActiveAccountContext);

	const [activeAccountWithBalance, setActiveAccountWithBalance] =
		useState<AccountType | null>(null);
	const [clientErrorOccurred, setClientErrorOccurred] =
		useState<boolean>(false);
	const [awaitingPlayResult, setAwaitingPlayResult] =
		useState<boolean>(false);
	const [playResult, setPlayResult] = useState<
		Play | DeployFailed | null
	>(null);

	const { deploy } = useWebSocketDeployData();

	const closeModal = () => {
		setModalOpen(false);
	};

	useEffect(() => {
		clickRef
			?.getActiveAccountWithBalance()
			?.then(activeAccountWithBalanceReturned => {
				setActiveAccountWithBalance(activeAccountWithBalanceReturned);
			});
	}, [activeAccountContext]);

	useEffect(() => {
		if (deploy !== null) {
			handleDeployProcessed(deploy);
		}
	}, [deploy]);

	const connectWallet = async () => {
		await clickRef?.signIn();
	};

	const initiatePlay = async () => {
		if (activeAccountWithBalance?.public_key == null) {
			setClientErrorOccurred(true);
			return;
		}
		const publicKey = CLPublicKey.fromHex(
			activeAccountWithBalance.public_key
		);
		const deploy = await preparePlayDeploy(publicKey);
		await signAndSendDeploy(deploy, publicKey);
		setAwaitingPlayResult(true);
		initiateDeployListener(publicKey);
	};

	const handleDeployProcessed = async (deploy: DeployMessage) => {
		if (deploy.detected_deploy.error === null) {
			try {
				await new Promise(r => setTimeout(r, 1000)); // Delay due to race condition
				const response = await getPlayByDeployHash(
					deploy.detected_deploy.deployHash
				);
				const play = response.data as Play;
				setPlayResult(play);
			} catch (error) {
				setClientErrorOccurred(true);
			}
		} else {
			console.error(`Deploy failed: ${deploy.detected_deploy.error}`);
			setPlayResult(DeployFailed.Failed);
		}
		setAwaitingPlayResult(false);
	};

	const modalStyle = {
		overlay: {
			backgroundColor: '#0E1126A0',
			zIndex: 2,
		},
		content: {
			...modalStyles,
			...{
				backgroundColor: theme.styleguideColors.backgroundPrimary,
				borderColor: theme.styleguideColors.backgroundPrimary,
			},
		},
	};

	return (
		<>
			{isOpen && (
				<ReactModal
					isOpen={isOpen}
					style={modalStyle}
					portalClassName={'portal'}
				>
					<ModalContainer>
						<ModalContent
							connectWallet={connectWallet}
							initiatePlay={initiatePlay}
							clientErrorOccurred={clientErrorOccurred}
							awaitingPlayResult={awaitingPlayResult}
							activeAccountWithBalance={activeAccountWithBalance}
							playResult={playResult}
							closeModal={closeModal}
						/>
					</ModalContainer>
				</ReactModal>
			)}
		</>
	);
};

export default Modal;

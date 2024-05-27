import React from 'react';
import { csprToMotes } from 'casper-js-sdk';
import { AccountType } from '@make-software/csprclick-core-types';
import {
	BuyTicketContent,
	DeployFailedContent,
	JackpotContent,
	LoadingContent,
	NotEnoughCsprContent,
	SomethingWentWrongContent,
	UnluckyContent,
	WelcomeModalContent,
	YouWonContent,
} from '../../components';
import { Play } from '../../types';
import { DeployFailed } from '../../services/requests/play-requests';

interface ModalStateProps {
	connectWallet: () => void;
	initiatePlay: () => void;
	clientErrorOccurred: boolean;
	awaitingPlayResult: boolean;
	activeAccountWithBalance: AccountType | null;
	playResult: Play | DeployFailed | null;
	closeModal: () => void;
}

const ModalState = (props: ModalStateProps) => {
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

export default ModalState;

import React from 'react';
import { csprToMotes } from 'casper-js-sdk';
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
import { DeployFailed } from '../../services/requests/play-requests';
import useManagePlay from '../../services/hooks/use-manage-play';
import { Play } from '../../types';

interface PlayResultStateProps {
	playResult: Play | DeployFailed;
	initiatePlay: () => void;
	closeModal: () => void;
}

const PlayResultState = ({
	playResult,
	initiatePlay,
	closeModal,
}: PlayResultStateProps) => {
	if (playResult == DeployFailed.Failed) {
		return (
			<DeployFailedContent
				handleButtonAction={initiatePlay}
				closeModal={closeModal}
			/>
		);
	}

	if (playResult.isJackpot) {
		return (
			<JackpotContent
				handleButtonAction={initiatePlay}
				closeModal={closeModal}
				prizeAmount={playResult.prizeAmount}
			/>
		);
	}

	if (parseInt(playResult.prizeAmount)) {
		return (
			<YouWonContent
				handleButtonAction={initiatePlay}
				closeModal={closeModal}
				prizeAmount={playResult.prizeAmount}
			/>
		);
	}

	return (
		<UnluckyContent
			handleButtonAction={initiatePlay}
			closeModal={closeModal}
		/>
	);
};

interface ModalStateProps {
	closeModal: () => void;
}

const ModalState = (props: ModalStateProps) => {
	const { closeModal } = props;

	const {
		data: playResult,
		loading: awaitingPlayResult,
		error: clientErrorOccurred,
		activeAccountWithBalance,
		connectWallet,
		initiatePlay,
	} = useManagePlay();

	const refreshPage = () => window.location.reload();
	const goToFaucet = () => {
		window.open('https://testnet.cspr.live/tools/faucet', '_blank');
	};

	const isNotEnoughBalance =
		activeAccountWithBalance != null &&
		(activeAccountWithBalance.balance == null ||
			parseInt(activeAccountWithBalance.balance) <
				csprToMotes(5).toNumber());

	if (isNotEnoughBalance) {
		return (
			<NotEnoughCsprContent
				handleButtonAction={goToFaucet}
				closeModal={closeModal}
			/>
		);
	}

	if (clientErrorOccurred) {
		return (
			<SomethingWentWrongContent
				handleButtonAction={refreshPage}
				closeModal={closeModal}
			/>
		);
	}

	if (awaitingPlayResult) {
		return <LoadingContent closeModal={closeModal} />;
	}

	if (playResult !== null) {
		return (
			<PlayResultState
				playResult={playResult}
				closeModal={closeModal}
				initiatePlay={initiatePlay}
			/>
		);
	}

	if (activeAccountWithBalance != null) {
		return (
			<BuyTicketContent
				handleButtonAction={initiatePlay}
				closeModal={closeModal}
			/>
		);
	}

	return (
		<WelcomeModalContent
			handleButtonAction={connectWallet}
			closeModal={closeModal}
		/>
	);
};

export default ModalState;

import React from 'react';
import Big from 'big.js';
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
import { csprToMotes } from 'casper-js-sdk';

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
    playerAccount,
    connectWallet,
    startPlaying,
    endPlaying,
    playResult,
  } = useManagePlay();

	const handleCloseModal = () => {
    endPlaying();
		closeModal();
	};

	const refreshPage = () => window.location.reload();
	const goToFaucet = () => {
		window.open('https://testnet.cspr.live/tools/faucet', '_blank');
	};

	const ticketPrice = Big(config.gas_price_in_cspr)
		.add(config.lottery_ticket_price_in_cspr)
		.toNumber();
	const isNotEnoughBalance =
		!!playerAccount &&
		(playerAccount.balance == null ||
			parseInt(playerAccount.balance) <
				csprToMotes(ticketPrice).toNumber());

	if (isNotEnoughBalance) {
		return (
			<NotEnoughCsprContent
				handleButtonAction={goToFaucet}
				closeModal={handleCloseModal}
			/>
		);
	}

	if (playResult.error) {
		return (
			<SomethingWentWrongContent
				handleButtonAction={refreshPage}
				closeModal={handleCloseModal}
			/>
		);
	}

	if (playResult.loading) {
		return <LoadingContent closeModal={handleCloseModal} />;
	}

	if (playResult.data !== null) {
		return (
			<PlayResultState
				playResult={playResult.data}
				closeModal={handleCloseModal}
				initiatePlay={startPlaying}
			/>
		);
	}

	if (playerAccount != null) {
		return (
			<BuyTicketContent
				handleButtonAction={startPlaying}
				closeModal={handleCloseModal}
			/>
		);
	}

	return (
		<WelcomeModalContent
			handleButtonAction={connectWallet}
			closeModal={handleCloseModal}
		/>
	);
};

export default ModalState;

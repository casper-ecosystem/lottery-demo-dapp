import React, { useEffect } from 'react';
import Big from 'big.js';
import {
	BuyTicketContent,
	TransactionFailedContent,
	JackpotContent,
	LoadingContent,
	NotEnoughCsprContent,
	SomethingWentWrongContent,
	UnluckyContent,
	WelcomeModalContent,
	YouWonContent,
} from '../../components';
import { TransactionFailed } from '../../services/requests/play-requests';
import useManagePlay from '../../services/hooks/use-manage-play';
import { Play } from '../../types';
import {CSPRToMotes, motesToCSPR} from '../../utils/currency';

interface PlayResultStateProps {
	playResult: Play | TransactionFailed;
	initiatePlay: () => void;
	closeModal: () => void;
}

const PlayResultState = ({
	playResult,
	initiatePlay,
	closeModal,
}: PlayResultStateProps) => {
	if (playResult == TransactionFailed.Failed) {
		return (
			<TransactionFailedContent
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

const ModalState = ({ closeModal }: ModalStateProps) => {
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

	useEffect(() => {
		if (playResult.cancelled) {
			handleCloseModal();
		}
	}, [playResult.cancelled]);

	const refreshPage = () => window.location.reload();
	const goToFaucet = () => {
		window.open('https://testnet.cspr.live/tools/faucet', '_blank');
	};

	const ticketPrice = Big(CSPRToMotes(config.gas_price_in_cspr))
		.add(CSPRToMotes(config.lottery_ticket_price_in_cspr))
		.toNumber();
	const isNotEnoughBalance =
		!!playerAccount &&
		(playerAccount.liquid_balance == null ||
			parseInt(playerAccount.liquid_balance) < ticketPrice);

	if (isNotEnoughBalance) {
		return (
			<NotEnoughCsprContent
				minimumBalance={motesToCSPR(ticketPrice.toString())}
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

	if (playResult.cancelled) {
		return null;
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

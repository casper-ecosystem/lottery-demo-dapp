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
		data: playResult,
		loading: loadingPlayResult,
		error: playError,
		activeAccountWithBalance,
		connectWallet,
		initiatePlay,
		closeDeploysWsConnection,
	} = useManagePlay();

	const handleCloseModal = () => {
		closeDeploysWsConnection();
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
		!!activeAccountWithBalance &&
		(activeAccountWithBalance.balance == null ||
			parseInt(activeAccountWithBalance.balance) <
				csprToMotes(ticketPrice).toNumber());

	if (isNotEnoughBalance) {
		return (
			<NotEnoughCsprContent
				handleButtonAction={goToFaucet}
				closeModal={handleCloseModal}
			/>
		);
	}

	if (playError) {
		return (
			<SomethingWentWrongContent
				handleButtonAction={refreshPage}
				closeModal={handleCloseModal}
			/>
		);
	}

	if (loadingPlayResult) {
		return <LoadingContent closeModal={handleCloseModal} />;
	}

	if (playResult !== null) {
		return (
			<PlayResultState
				playResult={playResult}
				closeModal={handleCloseModal}
				initiatePlay={initiatePlay}
			/>
		);
	}

	if (activeAccountWithBalance != null) {
		return (
			<BuyTicketContent
				handleButtonAction={initiatePlay}
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

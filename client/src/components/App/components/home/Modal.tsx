import React, { useEffect } from 'react';
import styled from 'styled-components';

import xButton from '../../../../images/x-button.svg';

import { useClickRef } from '@make-software/csprclick-ui';
import { ActiveAccountContext } from '../../../../App';
import { AccountType } from '@make-software/csprclick-core-types';
import { CLPublicKey } from 'casper-js-sdk';
import {
	getPlayByDeployHash,
	initiateDeployListener,
	preparePlayDeploy,
	signAndSendDeploy,
} from '../../../../casper-helper';
import { useWebSocketDeployData, DeployMessage } from '../../../WebSocketProvider';
import ModalContent from './ModalContent';
import { Play } from '../../../../play.interface';
import { DeployFailed } from '../../../../casper-helper';
import { usePlays } from './PlaysContext';

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
		backgroundColor: theme.backgroundPrimary,
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

interface ModalProps {
	modalInView: boolean;
	setModalInView: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Modal(props: ModalProps) {
	const activeAccountContext = React.useContext(ActiveAccountContext);
	const clickRef = useClickRef();
	const [activeAccountWithBalance, setActiveAccountWithBalance] = React.useState<AccountType | null>(null);
	const [clientErrorOccurred, setClientErrorOccurred] = React.useState<boolean>(false);
	const [awaitingPlayResult, setAwaitingPlayResult] = React.useState<boolean>(false);
	const [playResult, setPlayResult] = React.useState<Play | DeployFailed | null>(null);
	const { deploy } = useWebSocketDeployData();
	const { addPlay, getAndSetJackpot } = usePlays();
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
			setClientErrorOccurred(true);
			return;
		}
		const publicKey = CLPublicKey.fromHex(activeAccountWithBalance.public_key);
		const deploy = await preparePlayDeploy(publicKey);
		await signAndSendDeploy(deploy, publicKey);
		setAwaitingPlayResult(true);
		initiateDeployListener(publicKey);
	}

	async function handleDeployProcessed(deploy: DeployMessage) {
		if (deploy.detected_deploy.error === null) {
			try {
				await new Promise(r => setTimeout(r, 1000)); // Delay due to race condition
				const response = await getPlayByDeployHash(deploy.detected_deploy.deployHash);
				const play = response.data as Play;
				console.log(play);
				setPlayResult(play);
				addPlay(play);
				getAndSetJackpot();
			} catch (error) {
				setClientErrorOccurred(true);
			}
		} else {
			console.error(`Deploy failed: ${deploy.detected_deploy.error}`);
			setPlayResult(DeployFailed.Failed);
		}
		setAwaitingPlayResult(false);
	}

	return (
		<StyledOverlay onClick={disableModal}>
			<StyledModal onClick={handleModalClick}>
				<StyledxButton src={xButton} onClick={disableModal}></StyledxButton>
				<ModalContent
					connectWallet={connectWallet}
					linkToFaucet={linkToFaucet}
					initiatePlay={initiatePlay}
					clientErrorOccurred={clientErrorOccurred}
					awaitingPlayResult={awaitingPlayResult}
					activeAccountWithBalance={activeAccountWithBalance}
					playResult={playResult}
				/>
			</StyledModal>
		</StyledOverlay>
	);
}

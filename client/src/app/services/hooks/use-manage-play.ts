import { useContext, useEffect, useState } from 'react';
import { CLPublicKey } from 'casper-js-sdk';
import { useClickRef } from '@make-software/csprclick-ui';
import { AccountType } from '@make-software/csprclick-core-types';
import { Play } from '../../types';
import { ActiveAccountContext } from '../../../App';
import {
	DeployFailed,
	getPlayByDeployHash,
	initiateDeployListener,
	preparePlayDeploy,
	signAndSendDeploy,
} from '../requests/play-requests';
import {
	DeployMessage,
	useWebSocketDeployData,
} from '../WebSocketProvider';

const useManagePlay = () => {
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

	useEffect(() => {
		if (activeAccountContext && clickRef) {
			clickRef
				.getActiveAccountWithBalance()
				.then(accountWithBalance => {
					setActiveAccountWithBalance(accountWithBalance);
				});
		} else {
			setActiveAccountWithBalance(null);
		}
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
		if (!activeAccountWithBalance?.public_key) {
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
		if (!deploy.detected_deploy.error) {
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

	return {
		activeAccountWithBalance,
		playResult,
		awaitingPlayResult,
		clientErrorOccurred,
		connectWallet,
		initiatePlay,
	};
};

export default useManagePlay;

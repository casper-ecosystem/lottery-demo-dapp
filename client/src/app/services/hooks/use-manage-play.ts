import { useContext, useEffect, useState } from 'react';
import { CLPublicKey, encodeBase16 } from 'casper-js-sdk';
import { useClickRef } from '@make-software/csprclick-ui';
import { AccountType } from '@make-software/csprclick-core-types';
import { DeployMessage, Play } from '../../types';
import { ActiveAccountContext } from '../../../App';
import {
	DeployFailed,
	getLastPlayByAccountHash,
	preparePlayDeploy,
	signAndSendDeploy,
} from '../requests/play-requests';
import { useWebSockets } from './use-websockets';

interface ManagePlayData {
	data: Play | DeployFailed | null;
	loading: boolean;
	error: boolean;
	activeAccountWithBalance: AccountType | null;
	connectWallet: () => void;
	initiatePlay: () => void;
}

interface ManagePlayState {
	data: Play | DeployFailed | null;
	loading: boolean;
	error: boolean;
}

const useManagePlay = (): ManagePlayData => {
	const clickRef = useClickRef();
	const activeAccountContext = useContext(ActiveAccountContext);

	const [activeAccountWithBalance, setActiveAccountWithBalance] =
		useState<AccountType | null>(null);
	const [playResultState, setPlayResultState] =
		useState<ManagePlayState>({
			data: null,
			loading: false,
			error: false,
		});
	const [executedDeploy, setExecutedDeploy] =
		useState<DeployMessage | null>(null);

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

	const onOpenWsConnection = () => console.log('open ws connection');

	const onCloseWsConnection = () => {
		if (!executedDeploy) {
			setPlayResultState({ ...playResultState, error: true });
		}
	};

	const onReceiveWsMessage = (message: { data: DeployMessage }) => {
		setExecutedDeploy(message.data);
	};

	const { connect: joinToDeploysWsConnection } = useWebSockets({
		onOpen: onOpenWsConnection,
		onMessage: onReceiveWsMessage,
		onClose: onCloseWsConnection,
	});

	const initiatePlay = async () => {
		if (!activeAccountWithBalance?.public_key) {
			setPlayResultState({ ...playResultState, error: true });
			return;
		}

		const parsedActivePublicKey = CLPublicKey.fromHex(
			activeAccountWithBalance.public_key
		);

		const preparedDeploy = await preparePlayDeploy(
			parsedActivePublicKey
		);

		await signAndSendDeploy(preparedDeploy, parsedActivePublicKey);
		setPlayResultState({ ...playResultState, loading: true });
		joinToDeploysWsConnection();
	};

	const handleDeployProcessed = async (deploy: DeployMessage) => {
		if (!deploy.detected_deploy?.error && activeAccountContext) {
			try {
				const accountHash = encodeBase16(
					CLPublicKey.fromHex(
						activeAccountContext.public_key
					).toAccountHash()
				);
				const response = await getLastPlayByAccountHash(accountHash);

				const play = response.data[0] as Play;

				if (play.deployHash === deploy.detected_deploy.deployHash) {
					setPlayResultState({
						...playResultState,
						data: play,
						loading: false,
					});
				}
			} catch (error) {
				setPlayResultState({
					...playResultState,
					error: true,
					loading: false,
				});
			}
		} else {
			console.error(`Deploy failed: ${deploy.detected_deploy.error}`);
			setPlayResultState({
				...playResultState,
				data: DeployFailed.Failed,
				loading: false,
			});
		}
	};

	useEffect(() => {
		if (executedDeploy !== null) {
			handleDeployProcessed(executedDeploy);
		}
	}, [executedDeploy]);

	const connectWallet = async () => {
		await clickRef?.signIn();
	};

	return {
		...playResultState,
		activeAccountWithBalance,
		connectWallet,
		initiatePlay,
	};
};

export default useManagePlay;

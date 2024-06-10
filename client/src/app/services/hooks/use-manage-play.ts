import { useContext, useEffect, useState } from 'react';
import { CLPublicKey, encodeBase16 } from 'casper-js-sdk';
import { useClickRef } from '@make-software/csprclick-ui';
import { AccountType } from '@make-software/csprclick-core-types';
import { Deploy, DeployMessage, Play } from '../../types';
import { ActiveAccountContext } from '../../../App';
import {
	DeployFailed,
	getLastPlayByAccountHash,
	preparePlayDeploy,
	signAndSendDeploy,
} from '../requests/play-requests';
import { useWebSockets } from './use-websockets';
import { isDeploy } from '../../utils/formatters';
import { usePlaysData } from '../providers/PlaysContext';

interface ManagePlayData {
	data: Play | DeployFailed | null;
	loading: boolean;
	error: boolean;
	activeAccountWithBalance: AccountType | null;
	connectWallet: () => void;
	initiatePlay: () => void;
	closeDeploysWsConnection: () => void;
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
	const [executedDeploy, setExecutedDeploy] = useState<Deploy | null>(
		null
	);

	const { reloadPlaysData } = usePlaysData();

	const errorState = {
		data: null,
		loading: false,
		error: true,
	};

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
		if (executedDeploy !== null) {
			handleDeployProcessed(executedDeploy);
		}
	}, [executedDeploy]);

	const onReceiveWsMessage = (message: { data: string }) => {
		if (isDeploy(message.data)) {
			const deploy = JSON.parse(message.data) as DeployMessage;
			setExecutedDeploy(deploy.data);
		}
	};

	const onCloseWsConnection = () => {
		if (!executedDeploy) {
			setPlayResultState(errorState);
		}
	};

	const {
		connect: joinToDeploysWsConnection,
		close: closeDeploysWsConnection,
		readyState,
	} = useWebSockets({
		onMessage: onReceiveWsMessage,
		onClose: onCloseWsConnection,
	});

	const handleOpenConnection = () => {
		if (readyState === 1) {
			setExecutedDeploy(null);
		} else {
			joinToDeploysWsConnection(activeAccountWithBalance!.public_key);
		}
	};

	const initiatePlay = async () => {
		if (!activeAccountWithBalance?.public_key) {
			setPlayResultState(errorState);
			return;
		}

		const parsedActivePublicKey = CLPublicKey.fromHex(
			activeAccountWithBalance.public_key
		);

		const preparedDeploy = await preparePlayDeploy(
			parsedActivePublicKey
		);

		try {
			await signAndSendDeploy(preparedDeploy, parsedActivePublicKey);
			setPlayResultState({ ...playResultState, loading: true });
			handleOpenConnection();
		} catch (e) {
			setPlayResultState(errorState);
		}
	};

	const handleDeployProcessed = async (deploy: Deploy) => {
		if (!deploy.error_message && activeAccountContext) {
			try {
				const accountHash = encodeBase16(
					CLPublicKey.fromHex(
						activeAccountContext.public_key
					).toAccountHash()
				);
				const response = await getLastPlayByAccountHash(accountHash);

				const play = response.data[0] as any;

				if (play.deployHash === deploy.deploy_hash) {
					setPlayResultState({
						data: play,
						loading: false,
						error: false,
					});
					reloadPlaysData();
				} else {
					throw new Error('A new play was not created');
				}
			} catch (error) {
				setPlayResultState(errorState);
			}
		} else {
			console.error(`Deploy failed: ${deploy.error_message}`);
			setPlayResultState({
				...playResultState,
				data: DeployFailed.Failed,
				loading: false,
			});
		}
	};

	const connectWallet = async () => {
		await clickRef?.signIn();
	};

	return {
		...playResultState,
		activeAccountWithBalance,
		connectWallet,
		initiatePlay,
		closeDeploysWsConnection,
	};
};

export default useManagePlay;

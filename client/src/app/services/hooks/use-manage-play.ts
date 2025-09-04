import { useContext, useEffect, useState } from 'react';
import { CLPublicKey, encodeBase16 } from 'casper-js-sdk';
import { useClickRef } from '@make-software/csprclick-ui';
import {
	AccountType,
	TransactionStatus,
} from '@make-software/csprclick-core-types';
import { Deploy, Play } from '../../types';
import { ActiveAccountContext } from '../../../App';
import {
	DeployFailed,
	getLastPlayByAccountHash,
	preparePlayDeploy,
	signAndSendDeploy,
} from '../requests/play-requests';
import { usePlaysData } from '../providers/PlaysContext';

interface PlayResult {
	data: Play | DeployFailed | null;
	loading: boolean;
	cancelled: boolean;
	error: boolean;
}

interface ManagePlayData {
	playerAccount: AccountType | null;
	connectWallet: () => void;
	startPlaying: () => void;
	endPlaying: () => void;
	playResult: PlayResult;
}

const useManagePlay = (): ManagePlayData => {
	const clickRef = useClickRef();
	const activeAccountContext = useContext(ActiveAccountContext);

	const [playerAccount, setPlayerAccount] =
		useState<AccountType | null>(null);

	const [playResult, setPlayResult] = useState<PlayResult>({
		data: null,
		loading: false,
		cancelled: false,
		error: false,
	});

	const errorPlayResult = () => ({
		data: null,
		loading: false,
		cancelled: false,
		error: true,
	});

	const cancelledPlayResult = () => ({
		data: null,
		loading: false,
		cancelled: true,
		error: false,
	});

	const [executedDeploy, setExecutedDeploy] = useState<Deploy | null>(
		null
	);

	const { reloadPlaysData } = usePlaysData();

	useEffect(() => {
		if (activeAccountContext && clickRef) {
			clickRef
				.getActiveAccountAsync({ withBalance: true })
				.then(playerAccount => {
					setPlayerAccount(playerAccount);
				});
		} else {
			setPlayerAccount(null);
		}
	}, [activeAccountContext]);

	useEffect(() => {
		if (executedDeploy !== null) {
			handleDeployProcessed(executedDeploy);
		}
	}, [executedDeploy]);

	const handleDeployStatusUpdate = async (
		status: string,
		data: any
	) => {
		if (status === TransactionStatus.SENT) {
			setPlayResult({
				data: null,
				loading: true,
				cancelled: false,
				error: false,
			});
			setExecutedDeploy(null);
		} else if (status === TransactionStatus.CANCELLED) {
			setPlayResult(cancelledPlayResult());
		} else if (
			status === TransactionStatus.TIMEOUT ||
			status === TransactionStatus.ERROR
		) {
			setPlayResult(errorPlayResult());
		} else if (status === TransactionStatus.PROCESSED) {
			setTimeout(() => {
				setExecutedDeploy(data.csprCloudTransaction);
			}, 5000);
			setPlayResult(prev => ({
				...prev,
				loading: false,
				error: false,
			}));
		}
	};

	const startPlaying = async () => {
		if (!playerAccount?.public_key) {
			setPlayResult(errorPlayResult());
			return;
		}

		const playerPublicKey = CLPublicKey.fromHex(
			playerAccount.public_key
		);

		try {
			const preparedDeploy = await preparePlayDeploy(playerPublicKey);

			await signAndSendDeploy(
				preparedDeploy,
				playerPublicKey,
				handleDeployStatusUpdate
			);
		} catch (e) {
			setPlayResult(errorPlayResult());
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
					setPlayResult({
						data: play,
						loading: false,
						error: false,
						cancelled: false,
					});
					reloadPlaysData();
				} else {
					throw new Error('A new play was not created');
				}
			} catch (error) {
				setPlayResult(errorPlayResult());
			}
		} else {
			console.error(`Deploy failed: ${deploy.error_message}`);
			setPlayResult({
				...playResult,
				data: DeployFailed.Failed,
				loading: false,
			});
		}
	};

	const endPlaying = () => {
		setExecutedDeploy(null);
	};

	const connectWallet = async () => {
		await clickRef?.signIn();
	};

	return {
		playerAccount,
		connectWallet,
		startPlaying,
		endPlaying,
		playResult,
	};
};

export default useManagePlay;

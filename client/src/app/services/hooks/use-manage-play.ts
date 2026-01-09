import { useContext, useEffect, useState } from 'react';
import { PublicKey } from 'casper-js-sdk';
import { useClickRef } from '@make-software/csprclick-ui';
import {
	AccountType,
	TransactionStatus,
} from '@make-software/csprclick-core-types';
import { Transaction, Play } from '../../types';
import { ActiveAccountContext } from '../../../App';
import {
	TransactionFailed,
	getLastPlayByAccountHash,
	preparePlayTransaction,
} from '../requests/play-requests';
import { usePlaysData } from '../providers/PlaysContext';

interface PlayResult {
	data: Play | TransactionFailed | null;
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

	const [executedTransaction, setExecutedTransaction] = useState<Transaction | null>(
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
	}, [activeAccountContext, clickRef]);

	useEffect(() => {
		if (executedTransaction !== null) {
			handleTransactionProcessed(executedTransaction);
		}
	}, [executedTransaction]);

	const handleTransactionStatusUpdate = async (
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
			setExecutedTransaction(null);
		} else if (status === TransactionStatus.CANCELLED) {
			setPlayResult(cancelledPlayResult());
		} else if (
			status === TransactionStatus.TIMEOUT ||
			status === TransactionStatus.ERROR
		) {
			setPlayResult(errorPlayResult());
		} else if (status === TransactionStatus.PROCESSED) {
			setExecutedTransaction(data.csprCloudTransaction);
		}
	};

	const startPlaying = async () => {
		if (!playerAccount?.public_key) {
			setPlayResult(errorPlayResult());
			return;
		}

		const playerPublicKey = PublicKey.fromHex(
			playerAccount.public_key
		);

		try {
			const transaction = await preparePlayTransaction(playerPublicKey);

			await clickRef.send(
				transaction.toJSON() as object,
				playerPublicKey.toHex(),
				handleTransactionStatusUpdate
			);
		} catch (e) {
			setPlayResult(errorPlayResult());
		}
	};

	const handleTransactionProcessed = async (transaction: Transaction) => {
		if (!transaction.error_message && activeAccountContext) {
			try {
				const accountHash = PublicKey.fromHex(
						activeAccountContext.public_key
					).accountHash().toHex();

				/** we need interval to align receiving the 'processed' event from BE **/
				let attempts = 0;
				const intervalId = setInterval(async () => {
					attempts++;

					try {
						const response = await getLastPlayByAccountHash(
							accountHash
						);
						const play = response.data[0] as any;

						if (play.deployHash === transaction.deploy_hash) {
							clearInterval(intervalId);
							setPlayResult({
								data: play,
								loading: false,
								error: false,
								cancelled: false,
							});
							reloadPlaysData();
						} else if (attempts >= 7) {
							clearInterval(intervalId);
							setPlayResult({
								...playResult,
								error: true,
								loading: false,
							});
						}
					} catch (err) {
						clearInterval(intervalId);
						setPlayResult(errorPlayResult());
					}
				}, 1000);
			} catch (error) {
				setPlayResult(errorPlayResult());
			}
		} else {
			console.error(`Transaction failed: ${transaction.error_message}`);
			setPlayResult({
				...playResult,
				data: TransactionFailed.Failed,
				loading: false,
			});
		}
	};

	const endPlaying = () => {
		setExecutedTransaction(null);
	};

	const connectWallet = () => {
		clickRef?.signIn();
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

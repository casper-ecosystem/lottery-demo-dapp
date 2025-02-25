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
import { usePlaysData } from '../providers/PlaysContext';

interface PlayResult {
  data: Play | DeployFailed | null;
  loading: boolean;
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

  const [playResult, setPlayResult] =
    useState<PlayResult>({
      data: null,
      loading: false,
      error: false,
    });

  const errorPlayResult = {
    data: null,
    loading: false,
    error: true,
  };

  const [executedDeploy, setExecutedDeploy] = useState<Deploy | null>(
    null
  );

  const { reloadPlaysData } = usePlaysData();

  useEffect(() => {
    if (activeAccountContext && clickRef) {
      clickRef
        .getActiveAccountWithBalance()
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

  const onWebSocketMessage = (message: { data: string }) => {
    if (message.data) {
      const deploy = JSON.parse(message.data) as DeployMessage;
      setExecutedDeploy(deploy.data);
    }
  };

  const onWebSocketError = () => setPlayResult(errorPlayResult);

  const {
    connect: openPlayerDeploysWebSocketStream,
    close: closePlayerDeploysWebSocketStream,
    session,
  } = useWebSockets({
    onMessage: onWebSocketMessage,
    onClose: onWebSocketError,
    onError: onWebSocketError,
  });

  const waitForTheNextPlayerDeploy = () => {
    if (session && session?.readyState === WebSocket.OPEN) {
      setExecutedDeploy(null);
    } else {
      openPlayerDeploysWebSocketStream(playerAccount!.public_key);
    }
  };

  const startPlaying = async () => {
    if (!playerAccount?.public_key) {
      setPlayResult(errorPlayResult);
      return;
    }

    const playerPublicKey = CLPublicKey.fromHex(
      playerAccount.public_key
    );

    try {
      const preparedDeploy = await preparePlayDeploy(
        playerPublicKey
      );

      await signAndSendDeploy(preparedDeploy, playerPublicKey);

      setPlayResult({
        ...playResult,
        loading: true,
        error: false,
      });

      waitForTheNextPlayerDeploy();
    } catch (e) {
      setPlayResult(errorPlayResult);
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
          });
          reloadPlaysData();
        } else {
          throw new Error('A new play was not created');
        }
      } catch (error) {
        setPlayResult(errorPlayResult);
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
    if (!executedDeploy) {
      setPlayResult(errorPlayResult);
    } else {
      setExecutedDeploy(null);
    }

    closePlayerDeploysWebSocketStream();
  }

  const connectWallet = async () => {
    await clickRef?.signIn();
  };

  return {
    playerAccount,
    connectWallet,
    startPlaying,
    endPlaying,
    playResult
  };
};

export default useManagePlay;

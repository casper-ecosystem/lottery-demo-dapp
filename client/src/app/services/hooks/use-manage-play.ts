import { useContext, useEffect, useState } from 'react';
import { CLPublicKey, encodeBase16 } from 'casper-js-sdk';
import { useClickRef } from '@make-software/csprclick-ui';
import { AccountType } from '@make-software/csprclick-core-types';
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
  error: boolean;
}

interface ManagePlayData {
  playerAccount: AccountType | null;
  connectWallet: () => void;
  startPlaying: () => void;
  endPlaying: () => void;
  playResult: PlayResult;
}

const enum DeployStatus  {
  SENT = 'sent',
  PING = 'ping',
  PROCESSED = 'processed',
  TIMEOUT = 'timeout'

}
const useManagePlay = (): ManagePlayData => {
  const clickRef = useClickRef();
  const activeAccountContext = useContext(ActiveAccountContext);

  const [playerAccount, setPlayerAccount] =
    useState<AccountType | null>(null);

  const [status, setStatus] = useState<string | null>(null);

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

  useEffect(() => {
    if(status === DeployStatus.TIMEOUT) {
      setPlayResult(errorPlayResult);
    }
  }, [status])

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

  const handleDeployStatusUpdate = (status: string, data: any) => {
    setStatus(status);
    setPlayResult({
      ...playResult,
      loading: true,
      error: false,
    });
    if (status === DeployStatus.SENT) {
      setExecutedDeploy(null);
    } else if(status === DeployStatus.TIMEOUT) {
      setExecutedDeploy(null);
      setPlayResult(errorPlayResult);
    } else if (status === DeployStatus.PROCESSED) {
      setExecutedDeploy(data.csprCloudTransaction);
      setPlayResult({
        ...playResult,
        loading: false,
        error: false,
      });
    } else if(status === DeployStatus.PING) {
      setPlayResult({
        ...playResult,
        loading: true,
        error: false,
      });
    } else {
      setPlayResult(errorPlayResult);
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

      await signAndSendDeploy(preparedDeploy, playerPublicKey, handleDeployStatusUpdate);

      setPlayResult({
        ...playResult,
        loading: true,
        error: false,
      });

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

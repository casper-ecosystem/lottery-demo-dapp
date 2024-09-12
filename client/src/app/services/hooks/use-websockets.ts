import { useCallback, useEffect, useState } from 'react';
import { isDeploy } from '../../utils/formatters';

interface WebSocketMessage {
  data: string;
}

interface UseWebSocketsProps {
  onOpen?: () => void;
  onMessage: (message: WebSocketMessage) => void;
  onError: () => void;
  onClose: () => void;
}
const INACTIVITY_TIMEOUT = 120000;
const logOpenConnection = () => console.log('Opened WebSocket connection');

export const useWebSockets = ({
  onOpen = logOpenConnection,
  onMessage,
  onClose,
  onError,
}: UseWebSocketsProps) => {
  const [session, setSession] = useState(
    null as unknown as WebSocket
  );

  let timeoutId;
  function resetInactivityTimeout() {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(function () {
      console.log('No activity for 1 min. Closing WebSocket connection.');
      close();
    }, INACTIVITY_TIMEOUT);
  }

  const addEventHandler = (
    type: string,
    callback: (value: any) => void
  ) => {
    if (!session) return;
    session.addEventListener(type, callback);
    return () => {
      session.removeEventListener(type, callback);
    };
  };

  useEffect(
    () =>
      addEventHandler('open', () => {
        onOpen && onOpen();
        resetInactivityTimeout();
      }),
    [session, onOpen]
  );

  useEffect(
    () =>
      addEventHandler('message', event => {
        if (isDeploy(event.data)) {
          onMessage(event);
          resetInactivityTimeout();
        }
      }),
    [session, onMessage]
  );

  useEffect(
    () => addEventHandler('close', () => {
      onClose();
    }),
    [session, onClose]
  );

  useEffect(
    () =>
      addEventHandler('error', () => {
        onError();
        close();
      }),
    [session]
  );

  const open = useCallback((publicKey: string) => {
    const url = `${config.lottery_api_ws_url}/deploys?caller_public_key=${publicKey}`;
    const ws = new WebSocket(url);
    setSession(ws);
  }, [setSession]);

  const close = () => {
    if (session && session?.readyState === session?.OPEN) {
      session?.close();
      setSession(null as unknown as WebSocket);
    }
  };

  return { connect: open, close, session };
};

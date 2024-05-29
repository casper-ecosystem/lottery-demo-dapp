import { useCallback, useEffect, useState } from 'react';
import {
	WS_CLOSE_CODE,
	WS_CONNECTION_TIMEOUT,
} from '../../utils/constants';

interface UseWebSocketsProps {
	onOpen?: () => void;
	onMessage: (message: { data: string }) => void;
	onClose: () => void;
}

const logOpenWsConnection = () => console.log('open ws connection');

export const useWebSockets = ({
	onOpen = logOpenWsConnection,
	onMessage,
	onClose,
}: UseWebSocketsProps) => {
	const [session, setSession] = useState(
		null as unknown as WebSocket
	);

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

	useEffect(() => addEventHandler('open', onOpen), [session, onOpen]);
	useEffect(
		() => addEventHandler('message', onMessage),
		[session, onMessage]
	);
	useEffect(
		() => addEventHandler('close', onClose),
		[session, onClose]
	);

	const connect = useCallback((publicKey: string) => {
		const url = `${config.lottery_api_ws_url}?caller_public_key=${publicKey}`;
		const ws = new WebSocket(url);
		setSession(ws);
	}, []);

	const close = useCallback(() => {
		if (session?.readyState === session?.OPEN)
			session.close(WS_CLOSE_CODE);
	}, [session]);

	useEffect(() => {
		const timeout = setTimeout(() => {
			close();
		}, WS_CONNECTION_TIMEOUT);

		return () => {
			clearTimeout(timeout);
		};
	}, [session]);

	return { connect };
};

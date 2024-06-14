import { useCallback, useEffect, useState } from 'react';
import { isDeploy } from '../../utils/formatters';

interface WebSocketMessage {
	data: string;
}

interface UseWebSocketsProps {
	onOpen?: () => void;
	onMessage: (message: WebSocketMessage) => void;
	onClose: () => void;
}
const disconnectTimeout = 60000;
const logOpenWsConnection = () => console.log('open ws connection');

export const useWebSockets = ({
	onOpen = logOpenWsConnection,
	onMessage,
	onClose,
}: UseWebSocketsProps) => {
	const [session, setSession] = useState(
		null as unknown as WebSocket
	);

	let timeoutId;
	function resetMessageTimeout() {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(function () {
			console.log(
				'No deploy received for 1 min, closing connection...'
			);
			close();
		}, disconnectTimeout);
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
				resetMessageTimeout();
			}),
		[session, onOpen]
	);
	useEffect(
		() =>
			addEventHandler('message', event => {
				if (isDeploy(event.data)) {
					onMessage(event);
					resetMessageTimeout();
				}
			}),
		[session, onMessage]
	);
	useEffect(
		() => addEventHandler('close', onClose),
		[session, onClose]
	);

	useEffect(
		() =>
			addEventHandler('error', () => {
				close();
			}),
		[session]
	);

	const connect = useCallback((publicKey: string) => {
		const url = `${config.lottery_api_ws_url}?caller_public_key=${publicKey}`;
		const ws = new WebSocket(url);
		setSession(ws);
	}, []);

	const close = () => {
		if (session?.readyState === session?.OPEN) {
			session?.close();
			setSession(null as unknown as WebSocket);
		}
	};

	return { connect, close, readyState: session?.readyState };
};

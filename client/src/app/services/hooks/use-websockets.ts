import { useCallback, useEffect, useState } from 'react';

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

	const updateHandler = (
		type: string,
		callback: (value: any) => void
	) => {
		if (!session) return;
		session.addEventListener(type, callback);
		return () => {
			session.removeEventListener(type, callback);
		};
	};

	useEffect(() => updateHandler('open', onOpen), [session, onOpen]);
	useEffect(
		() => updateHandler('message', onMessage),
		[session, onMessage]
	);
	useEffect(
		() => updateHandler('close', onClose),
		[session, onClose]
	);

	const connect = useCallback((publicKey: string) => {
		const url = `${config.lottery_api_ws_url}?caller_public_key=${publicKey}`;
		const ws = new WebSocket(url);
		setSession(ws);
	}, []);

	return { connect };
};

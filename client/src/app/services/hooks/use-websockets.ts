import { useCallback, useEffect, useState } from 'react';

interface UseWebSocketsProps {
	onOpen: () => void;
	onMessage: (message: any) => void;
	onClose: () => void;
}
export const useWebSockets = ({
	onOpen,
	onMessage,
	onClose,
}: UseWebSocketsProps) => {
	const [session, setSession] = useState(
		null as unknown as WebSocket
	);

	const updateOpenHandler = () => {
		if (!session) return;
		session.addEventListener('open', onOpen);
		return () => {
			session.removeEventListener('open', onOpen);
		};
	};

	const updateMessageHandler = () => {
		if (!session) return;
		session.addEventListener('message', onMessage);
		return () => {
			session.removeEventListener('message', onMessage);
		};
	};

	const updateCloseHandler = () => {
		if (!session) return;
		session.addEventListener('close', onClose);
		return () => {
			session.removeEventListener('close', onClose);
		};
	};

	useEffect(updateOpenHandler, [session, onOpen]);
	useEffect(updateMessageHandler, [session, onMessage]);
	useEffect(updateCloseHandler, [session, onClose]);

	const connect = useCallback(() => {
		const uri = config.lottery_api_ws_url;
		const ws = new WebSocket(uri);
		setSession(ws);
	}, []);

	return { connect };
};

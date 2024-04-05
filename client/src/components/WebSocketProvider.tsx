import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface DeployMessage {
	detected_deploy: {
		error: string | null;
		deployHash: string;
	};
}

interface WebSocketContextType {
	deploy: DeployMessage | null;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
	children: ReactNode;
}

function isDeploy(object: DeployMessage) {
	return (
		object.detected_deploy !== null &&
		(object.detected_deploy.error === null || typeof object.detected_deploy.error === 'string') &&
		typeof object.detected_deploy.deployHash === 'string'
	);
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
	const [deploy, setDeploy] = useState<DeployMessage | null>(null);

	useEffect(() => {
		const ws = new WebSocket(`ws://${config.lottery_api_ws_url}`);

		ws.onopen = () => {
			console.log('Connected to the server');
		};

		ws.onmessage = event => {
			try {
				const message = JSON.parse(event.data);
				console.log('Message from server:', message);
				if (isDeploy(message)) {
					setDeploy(message);
				}
			} catch (error) {
				console.error(error);
			}
		};

		ws.onerror = error => {
			console.log('WebSocket error:', error);
		};

		ws.onclose = () => {
			console.log('Disconnected from the server');
		};

		return () => {
			if (ws.readyState === 1) {
				ws.close();
			}
		};
	}, []);

	return <WebSocketContext.Provider value={{ deploy }}>{children}</WebSocketContext.Provider>;
};

export const useWebSocketDeployData = (): WebSocketContextType => {
	const context = useContext(WebSocketContext);
	if (context === undefined) {
		throw new Error('useWebSocketData must be used within a WebSocketProvider');
	}
	return context;
};

import { createContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import {
	useClickRef,
	ThemeModeType,
} from '@make-software/csprclick-ui';
import { AppTheme } from './app/theme';
import Router from './app/router';
import { WebSocketProvider } from './app/services/WebSocketProvider';

type ActiveAccountContextType = {
	balance: string;
	connected_at: number;
	last_used: number;
	liquid_balance: string;
	logo: string | undefined;
	name: string | null;
	provider: string;
	public_key: string;
	token: string | null;
};

export const ActiveAccountContext =
	createContext<ActiveAccountContextType | null>(null);

const App = () => {
	const clickRef = useClickRef();
	const [activeAccount, setActiveAccount] = useState<any>(null);

	useEffect(() => {
		clickRef?.on('csprclick:signed_in', async (evt: any) => {
			await setActiveAccount(evt.account);
		});
		clickRef?.on('csprclick:switched_account', async (evt: any) => {
			await setActiveAccount(evt.account);
		});
		clickRef?.on('csprclick:signed_out', async (evt: any) => {
			setActiveAccount(null);
		});
		clickRef?.on('csprclick:disconnected', async (evt: any) => {
			setActiveAccount(null);
		});
	}, [clickRef?.on]);

	return (
		<ThemeProvider theme={AppTheme[ThemeModeType.light]}>
			<ActiveAccountContext.Provider value={activeAccount}>
				<WebSocketProvider>
					<Router />
				</WebSocketProvider>
			</ActiveAccountContext.Provider>
		</ThemeProvider>
	);
};

export default App;

import { createContext, useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import {
	ThemeModeType,
	useClickRef,
} from '@make-software/csprclick-ui';
import { AppTheme } from './app/theme';
import Router from './app/router';
import { AccountType } from '@make-software/csprclick-core-types';

export const ActiveAccountContext =
	createContext<AccountType | null>(null);

const App = () => {
	const clickRef = useClickRef();
	const [connectedAccount, setConnectedAccount] = useState<AccountType | null>(null);


	useEffect(() => {
		if (!clickRef) return;

		const handleSignedIn = (evt: any) => setConnectedAccount(evt.account);
		const handleSwitchedAccount = (evt: any) => setConnectedAccount(evt.account);
		const handleSignedOut = () => setConnectedAccount(null);

		clickRef.on('csprclick:signed_in', handleSignedIn);
		clickRef.on('csprclick:switched_account', handleSwitchedAccount);
		clickRef.on('csprclick:signed_out', handleSignedOut);

		return () => {
			clickRef.off('csprclick:signed_in', handleSignedIn);
			clickRef.off('csprclick:switched_account', handleSwitchedAccount);
			clickRef.off('csprclick:signed_out', handleSignedOut);
		};
	}, [clickRef?.on]);

	return (
		<ThemeProvider theme={AppTheme[ThemeModeType.light]}>
			<ActiveAccountContext.Provider value={connectedAccount}>
				<Router />
			</ActiveAccountContext.Provider>
		</ThemeProvider>
	);
};

export default App;

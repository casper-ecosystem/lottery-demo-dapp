import { useEffect, useState } from 'react';
import { ThemeProvider } from 'styled-components';
import {
	useClickRef,
	ThemeModeType,
} from '@make-software/csprclick-ui';
import { AppTheme } from './app/theme';
import Router from './app/router';

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
			<Router />
		</ThemeProvider>
	);
};

export default App;

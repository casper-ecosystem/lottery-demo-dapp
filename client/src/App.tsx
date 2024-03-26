import { useEffect, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { useClickRef, ThemeModeType } from '@make-software/csprclick-ui';
import ClickTopBar from './components/ClickTopBar';
import Container from './components/container';
import Modal from './components/App/components/Modal';
import { AppTheme } from './theme';
import { Welcome } from './components/App/components';
import Landing from './components/App/index';
import React from 'react';
import Header from './components/App/components/Header';

const ContentContainer = styled.div(({ theme }) =>
	theme.withMedia({
		maxWidth: ['100%', '720px', '960px'],
		padding: '0 12px',
		margin: '0 auto',
	})
);

export interface SetModalInViewProps {
	setModalInView: React.Dispatch<React.SetStateAction<boolean>>;
}

export const ActiveAccountContext = React.createContext(null);

const App = () => {
	const clickRef = useClickRef();
	const [themeMode, setThemeMode] = useState<ThemeModeType>(ThemeModeType.light);
	const [activeAccount, setActiveAccount] = useState<any>(null);
	const [modalInView, setModalInView] = useState<boolean>(false);

	useEffect(() => {
		clickRef?.on('csprclick:signed_in', async (evt: any) => {
			setActiveAccount(evt.account);
		});
		clickRef?.on('csprclick:switched_account', async (evt: any) => {
			setActiveAccount(evt.account);
		});
		clickRef?.on('csprclick:signed_out', async (evt: any) => {
			setActiveAccount(null);
		});
		clickRef?.on('csprclick:disconnected', async (evt: any) => {
			setActiveAccount(null);
		});
	}, [clickRef?.on]);

	return (
		<ThemeProvider theme={AppTheme[themeMode]}>
			<ClickTopBar
				themeMode={themeMode}
				onThemeSwitch={() => setThemeMode(themeMode === ThemeModeType.light ? ThemeModeType.dark : ThemeModeType.light)}
			/>
			<Container>
				<Header />
				<ActiveAccountContext.Provider value={activeAccount}>
					<Welcome setModalInView={setModalInView} />

					<ContentContainer>
						<Landing setModalInView={setModalInView} />
					</ContentContainer>
					<Modal modalInView={modalInView} setModalInView={setModalInView} />
				</ActiveAccountContext.Provider>
			</Container>
		</ThemeProvider>
	);
};

export default App;

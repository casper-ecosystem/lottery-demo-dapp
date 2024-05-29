import { createContext } from 'react';
import { ThemeProvider } from 'styled-components';
import { ThemeModeType } from '@make-software/csprclick-ui';
import { AppTheme } from './app/theme';
import Router from './app/router';
import { ActiveAccountType } from './app/types';
import useCsprClick from './app/services/hooks/use-cspr-click';

export const ActiveAccountContext =
	createContext<ActiveAccountType | null>(null);

const App = () => {
	const { activeAccount } = useCsprClick();

	return (
		<ThemeProvider theme={AppTheme[ThemeModeType.light]}>
			<ActiveAccountContext.Provider value={activeAccount}>
				<Router />
			</ActiveAccountContext.Provider>
		</ThemeProvider>
	);
};

export default App;

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import HomeScene from '../scenes/home';
import PageHeader from '../components/page-header/page-header';
import {
	HOME_PATH,
	ABOUT_PATH,
	JACKPOTS_PATH,
	MY_PLAYS_PATH,
	JACKPOT_PLAYS_PATH,
} from './paths';
import { FlexColumn } from '@make-software/cspr-ui';
import AboutScene from '../scenes/about';
import JackpotsScene from '../scenes/jackpots';
import JackpotRoundScene from '../scenes/round';
import MyPlaysScene from '../scenes/my-plays';

export const Container = styled(FlexColumn)(({ theme }) => ({
	minWidth: theme.minWidth,
	alignItems: 'center',
	backgroundColor: theme.styleguideColors.backgroundSecondary,
	color: theme.styleguideColors.contentPrimary,
}));

const Router = () => {
	return (
		<BrowserRouter>
			<Container>
				<PageHeader />
				<Routes>
					<Route path={HOME_PATH} element={<HomeScene />} />
					<Route path={ABOUT_PATH} element={<AboutScene />} />
					<Route path={JACKPOTS_PATH} element={<JackpotsScene />} />
					<Route
						path={JACKPOT_PLAYS_PATH}
						element={<JackpotRoundScene />}
					/>
					<Route path={MY_PLAYS_PATH} element={<MyPlaysScene />} />
				</Routes>
			</Container>
		</BrowserRouter>
	);
};

export default Router;

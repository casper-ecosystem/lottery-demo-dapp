import { MainMenu, MainMenuItem } from '@make-software/cspr-ui';
import {
	ABOUT_PATH,
	HOME_PATH,
	JACKPOTS_PATH,
} from '../../router/paths';
import styled from 'styled-components';
import MenuLink from './menu-link';

const MainMenuContainer = styled.div(({ theme }) =>
	theme.withMedia({
		position: 'relative',
		padding: 0,
		paddingBottom: [19, 19, 0],
		width: ['100%', '100%', 'auto'],
		'& li': {
			':last-child': {
				paddingRight: 0,
			},
		},
	})
);

const NavigationMenu = () => {
	return (
		<MainMenuContainer>
			<MainMenu>
				<MainMenuItem>
					<MenuLink to={HOME_PATH}>Home</MenuLink>
				</MainMenuItem>
				<MainMenuItem>
					<MenuLink to={ABOUT_PATH}>About</MenuLink>
				</MainMenuItem>
				<MainMenuItem>
					<MenuLink to={JACKPOTS_PATH}>Jackpots</MenuLink>
				</MainMenuItem>
			</MainMenu>
		</MainMenuContainer>
	);
};

export default NavigationMenu;

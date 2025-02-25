import styled from 'styled-components';
import { MainMenu, MainMenuItem, Link } from '../../components';
import {
	ABOUT_PATH,
	HOME_PATH,
	JACKPOTS_PATH,
} from '../../router/paths';

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

export const NavigationMenu = () => {
	return (
		<MainMenuContainer>
			<MainMenu>
				<MainMenuItem>
					<Link to={HOME_PATH}>Home</Link>
				</MainMenuItem>
				<MainMenuItem>
					<Link to={ABOUT_PATH}>About</Link>
				</MainMenuItem>
				<MainMenuItem>
					<Link to={JACKPOTS_PATH}>Jackpots</Link>
				</MainMenuItem>
			</MainMenu>
		</MainMenuContainer>
	);
};

export default NavigationMenu;

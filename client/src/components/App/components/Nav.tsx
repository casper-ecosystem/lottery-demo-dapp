import styled from 'styled-components';
import logo from '../../../images/logo.svg';
import { Link, useLocation } from 'react-router-dom';

const StyledNav = styled.nav(({ theme }) =>
	theme.withMedia({
		height: '72px',
		marginTop: '40px',
		backgroundColor: theme.topBarBackground,
	})
);

const StyledNavDiv = styled.div(({ theme }) =>
	theme.withMedia({
		margin: 'auto',
		width: ['516px', '696px', '936px'],
		height: '100%',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	})
);

const StyledButtons = styled.div(({ theme }) =>
	theme.withMedia({
		display: 'flex',
		gap: '2em',
	})
);

const activeButtonColor = '#FFF';

interface StyledLinkProps {
	color?: string;
}

const StyledLink = styled(Link)<StyledLinkProps>(({ theme, color }) =>
	theme.withMedia({
		color: `${color ?? '#BABBBF'} !important`,
	})
);

enum Paths {
	Home = '/',
	About = '/about',
	Jackpots = '/jackpots',
}

export default function Nav() {
	const location = useLocation();
	const homePath = '/';
	const aboutPath = '/about';

	return (
		<StyledNav>
			<StyledNavDiv>
				<img src={logo} />
				<StyledButtons>
					<StyledLink to={Paths.Home} color={location.pathname === Paths.Home ? activeButtonColor : undefined}>
						Home
					</StyledLink>
					<StyledLink to={Paths.About} color={location.pathname === Paths.About ? activeButtonColor : undefined}>
						About
					</StyledLink>
					<StyledLink to={Paths.Jackpots} color={location.pathname === Paths.Jackpots ? activeButtonColor : undefined}>
						Jackpots
					</StyledLink>
				</StyledButtons>
			</StyledNavDiv>
		</StyledNav>
	);
}

import styled from 'styled-components';
import logo from '../../../images/logo.svg';

const StyledHeader = styled.div(({ theme }) =>
	theme.withMedia({
		height: '72px',
		marginTop: '40px',
		backgroundColor: theme.topBarBackground,
	})
);

const StyledHeaderDiv = styled.div(({ theme }) =>
	theme.withMedia({
		margin: 'auto',
		width: ['516px', '696px', '936px'],
		height: '100%',
		display: 'flex',
		justifyContent: 'space-between',
	})
);

const StyledButtons = styled.div(({ theme }) =>
	theme.withMedia({
		display: 'flex',
		gap: '2em',
	})
);

const activeButtonColor = '#FFF';

interface StyledButtonProps {
	color?: string;
}

const StyledButton = styled.button<StyledButtonProps>(({ theme, color }) =>
	theme.withMedia({
		background: 'none !important',
		border: 'none',
		padding: '0 !important',
		color: `${color ?? '#BABBBF'} !important`,
	})
);

export default function Header() {
	return (
		<StyledHeader>
			<StyledHeaderDiv>
				<img src={logo} />
				<StyledButtons>
					<StyledButton color={activeButtonColor}>Home</StyledButton>
					<StyledButton>About</StyledButton>
					<StyledButton>Jackpots</StyledButton>
				</StyledButtons>
			</StyledHeaderDiv>
		</StyledHeader>
	);
}

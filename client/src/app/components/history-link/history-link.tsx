import styled from 'styled-components';
import { NavLink, BodyText } from '@make-software/cspr-design';

const StyledWrapper = styled.span(({ theme }) => ({
	color: theme.styleguideColors.contentBlue,
	'& > *': {
		color: theme.styleguideColors.contentBlue,
	},
	'&:hover > *': {
		color: theme.styleguideColors.fillPrimaryRed,
	},
	'&:active > *': {
		color: theme.styleguideColors.fillPrimaryRedClick,
	},
}));

interface HistoryLinkProps {
	href: string;
	target?: string;
	children: React.ReactNode;
	monotype?: boolean;
}

export const HistoryLink = ({
	href,
	children,
	target,
	monotype = false,
}: HistoryLinkProps) => {
	return (
		<StyledWrapper>
			<NavLink href={href} target={target}>
				<BodyText size={3} monotype={monotype}>
					{children}
				</BodyText>
			</NavLink>
		</StyledWrapper>
	);
};

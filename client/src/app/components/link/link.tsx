import RouterLink from './router-link';
import styled from 'styled-components';
import { NavLink, BodyText } from '@make-software/cspr-design';

export enum LinkVariation {
	'blue' = 'blue',
	'gray' = 'gray',
}

const StyledWrapper = styled.span<{ variation: LinkVariation }>(
	({ theme, variation }) => ({
		...(variation === 'blue' && {
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
		}),
	})
);

interface LinkProps {
	to: string;
	children: React.ReactNode;
	onClick?: () => void;
	variation?: LinkVariation;
}
export const Link = ({
	to,
	children,
	variation = LinkVariation.gray,
}: LinkProps) => (
	<RouterLink
		to={to}
		render={props => (
			<StyledWrapper variation={variation}>
				<NavLink
					{...props}
					href={to}
					onClick={ev => {
						if (!(ev.ctrlKey || ev.metaKey || ev.shiftKey)) {
							ev.preventDefault();
							props.onClick && props.onClick();
						}
					}}
				>
					<BodyText size={3}>{children}</BodyText>
				</NavLink>
			</StyledWrapper>
		)}
	/>
);

import { BodyText, NavLink } from '@make-software/cspr-ui';
import RouterLink from './router-link';

interface MenuLinkProps {
	to: string;
	children: any;
	onClick?: () => void;
}
const MenuLink = ({ to, children }: MenuLinkProps) => (
	<RouterLink
		to={to}
		render={props => (
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
		)}
	/>
);

export default MenuLink;

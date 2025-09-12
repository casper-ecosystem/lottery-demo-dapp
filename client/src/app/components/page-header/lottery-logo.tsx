import Logo from '../../../assets/logos/lottery-logo.svg';
import { HOME_PATH } from '../../router/paths';
import RouterLink from '../link/router-link';
import { NavLink, SvgIcon } from '@make-software/cspr-design';

const LotteryLogo = () => {
	return (
		<RouterLink
			to={HOME_PATH}
			render={props => (
				<NavLink>
					<SvgIcon src={Logo} width={162} height={72} {...props} />
				</NavLink>
			)}
		/>
	);
};

export default LotteryLogo;

import { AccountMenuItem as CsprClickAccountMenuItem } from '@make-software/csprclick-ui';
import CupIcon from '../../../../assets/icons/cup.svg';
import { useNavigate } from 'react-router-dom';
import { MY_PLAYS_PATH } from '../../../router/paths';

const AccountMenuItem = () => {
	const navigate = useNavigate();

	const navigateToMyPlays = () => {
		navigate(MY_PLAYS_PATH);
	};
	return (
		<CsprClickAccountMenuItem
			key={2}
			onClick={navigateToMyPlays}
			icon={CupIcon}
			label={'My plays'}
		/>
	);
};

export default AccountMenuItem;

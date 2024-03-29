import { AccountMenuItem, CopyHashMenuItem, ViewAccountOnExplorerMenuItem } from '@make-software/csprclick-ui';
import trophy from '../../../images/icons/account-menu-trophy.svg';
import styled from 'styled-components';

export const accountMenuItems = [
	<ViewAccountOnExplorerMenuItem key={0} />,
	<CopyHashMenuItem key={1} />,
	<AccountMenuItem
		key={2}
		onClick={() => {
			window.open('https://docs.cspr.click', '_blank');
		}}
		icon={trophy}
		label={'My plays'}
	/>,
];

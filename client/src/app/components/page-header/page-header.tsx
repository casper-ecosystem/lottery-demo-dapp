import { useState } from 'react';
import styled from 'styled-components';
import ClickTopBar from '../click-top-bar';
import { NavigationMenu } from '../../components';
import HamburgerIcon from '../../../assets/icons/hamburger-menu.svg';
import { useMatchMedia } from '../../utils/match-media';
import LotteryLogo from './lottery-logo';
import {
	FlexColumn,
	FlexRow,
	SvgIcon,
} from '@make-software/cspr-design';

const PageHeaderWrapper = styled(FlexColumn)(({ theme }) =>
	theme.withMedia({
		background: theme.styleguideColors.backgroundTertiary,
		padding: 0,
		width: '100%',
	})
);

const NavBarContainer = styled(FlexRow)(({ theme }) =>
	theme.withMedia({
		justifyContent: 'space-between',
		alignItems: 'center',
		maxWidth: theme.maxWidth,
		width: '100%',
		padding: ['19px 16px', '19px 32px', '0px 56px', '0px'],
		height: ['auto', 'auto', 'auto', '72px'],
		margin: [0],
	})
);

const HamburgerButton = styled(SvgIcon)(({ theme }) => ({
	color: theme.styleguideColors.contentTertiary,
	':hover, :active': {
		color: theme.styleguideColors.contentOnFill,
	},
}));

export const PageHeader = () => {
	const [menuVisible, setMenuVisible] = useState(false);

	const onMobile = (
		<FlexColumn justify={'center'}>
			<NavBarContainer>
				<LotteryLogo />
				<HamburgerButton
					src={HamburgerIcon}
					size={16}
					onClick={() => {
						setMenuVisible(visible => !visible);
					}}
				/>
			</NavBarContainer>
			{menuVisible && <NavigationMenu />}
		</FlexColumn>
	);

	const onAbove = (
		<FlexRow justify={'center'}>
			<NavBarContainer>
				<LotteryLogo />
				<FlexRow align={'end'}>
					<NavigationMenu />
				</FlexRow>
			</NavBarContainer>
		</FlexRow>
	);

	const responsiveNavigation = useMatchMedia(
		[onMobile, onMobile, onAbove],
		[menuVisible]
	);

	return (
		<PageHeaderWrapper justify={'center'}>
			<ClickTopBar />
			{responsiveNavigation}
		</PageHeaderWrapper>
	);
};

export default PageHeader;

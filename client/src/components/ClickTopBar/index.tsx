import { useState } from 'react';
import { ClickUI, Lang, ThemeModeType } from '@make-software/csprclick-ui';
import { accountMenuItems } from './settings';
import { homeSettings, homeSetting } from './settings/home';
import styled from 'styled-components';
export * from './settings';

const TopBarSection = styled.section(({ theme }) => ({
	backgroundColor: theme.topBarBackground,
	position: 'fixed',
	zIndex: 1,
	width: '100%',
}));

const TopBarContainer = styled.div(({ theme }) =>
	theme.withMedia({
		display: 'flex',
		flexDirection: 'row',
		width: '100%',
		maxWidth: ['540px', '720px', '960px'],
		margin: '0 auto',
		padding: '0 12px',
	})
);

export interface TopBarProps {
	themeMode: ThemeModeType | undefined;
	onThemeSwitch: () => void;
}

const ClickTopBar = ({ themeMode, onThemeSwitch }: TopBarProps) => {
	const [location, setLocation] = useState<string>('home');

	return (
		<TopBarSection>
			<TopBarContainer>
				<ClickUI
					topBarSettings={{
						onThemeSwitch: onThemeSwitch,
						accountMenuItems: accountMenuItems,
						customTopBarMenuSettings: [homeSettings(location, setLocation)],
					}}
					themeMode={themeMode}
				/>
			</TopBarContainer>
		</TopBarSection>
	);
};

export default ClickTopBar;

import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const MenuContainer = styled.ul(({ theme }) =>
	theme.withMedia({
		background: theme.styleguideColors.backgroundTertiary,
		display: 'flex',
		flexDirection: ['column', 'column', 'row'],
		justifyContent: 'space-between',
		alignItems: ['baseline', 'baseline', 'center'],
		height: '100%',
		width: '100%',
		padding: ['0px'],
		margin: [0],
	})
);

export const MainMenu = ({ children }: PropsWithChildren<any>) => {
	return <MenuContainer>{children}</MenuContainer>;
};

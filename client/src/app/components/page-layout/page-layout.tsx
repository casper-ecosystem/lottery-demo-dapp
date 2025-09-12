import React from 'react';
import styled from 'styled-components';

import { FlexColumn, HeaderText } from '@make-software/cspr-design';

export const Header = styled(HeaderText)(() => ({
	paddingTop: 32,
	paddingBottom: 24,
}));

const Content = styled(FlexColumn)(({ theme }) =>
	theme.withMedia({
		width: '100%',
		maxWidth: theme.maxWidth,
		padding: [
			'0px 16px 33px',
			'0px 32px 60px',
			'0px 56px 76px',
			'0px 0px 76px',
		],
	})
);

export interface PageLayoutProps {
	children: React.ReactNode;
	title: string;
	renderHeader?: () => React.ReactNode;
}

export const PageLayout = (props: PageLayoutProps) => {
	const { children, renderHeader, title } = props;

	document.title = title;

	return (
		<Content>
			{renderHeader && <Header size={2}>{renderHeader()}</Header>}
			{children}
		</Content>
	);
};

export default PageLayout;

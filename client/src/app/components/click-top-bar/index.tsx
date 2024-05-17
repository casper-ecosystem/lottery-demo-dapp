import styled from 'styled-components';
import { ClickUI } from '@make-software/csprclick-ui';
import { accountMenuItems } from './settings';
export * from './settings';

const ClickTopBarContainer = styled.div(({ theme }) =>
	theme.withMedia({
		background: theme.styleguideColors.backgroundTertiary,
		width: '100%',
		maxWidth: 1176,
		margin: '0 auto',
		padding: ['0px 16px', '0px 32px', '0px 56px', '0px'],
	})
);

const ClickTopBar = () => {
	return (
		<ClickTopBarContainer>
			<ClickUI
				topBarSettings={{
					accountMenuItems: accountMenuItems,
				}}
			/>
		</ClickTopBarContainer>
	);
};

export default ClickTopBar;

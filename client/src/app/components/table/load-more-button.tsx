import React from 'react';
import styled from 'styled-components';
import { Button, FlexRow } from '../../components';

const ButtonContainer = styled(FlexRow)(({ theme }) =>
	theme.withMedia({
		padding: '20px',
		position: 'relative',
		':after': {
			content: "''",
			position: 'absolute',
			left: 20,
			right: 20,
			top: 0,
			borderTop: theme.border.tableRowSeparator,
		},
	})
);

interface LoadMoreButtonProps {
	handleLoadMore: () => void;
	handleReset: () => void;
	isCollapsed: boolean;
}

export const LoadMoreButton = ({
	handleLoadMore,
	handleReset,
	isCollapsed,
}: LoadMoreButtonProps) => {
	return (
		<ButtonContainer>
			{isCollapsed ? (
				<Button color={'secondaryRed'} onClick={handleLoadMore}>
					Load more
				</Button>
			) : (
				<Button color={'secondaryRed'} onClick={handleReset}>
					Load less
				</Button>
			)}
		</ButtonContainer>
	);
};

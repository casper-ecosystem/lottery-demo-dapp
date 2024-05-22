import React, { ReactNode } from 'react';
import styled from 'styled-components';

import {
	BodyText,
	Button,
	FlexRow,
	formatNumber,
	TableBody,
	TableHead,
} from '@make-software/cspr-ui';

export const TableContainer = styled.div(({ theme }) => ({
	overflowX: 'auto',
}));

const StyledTable = styled.table(({ theme }) => ({
	width: '100%',
	position: 'relative',
	borderCollapse: 'collapse',
}));

const PaginationContainer = styled(FlexRow)(({ theme }) =>
	theme.withMedia({
		height: 48,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: '12px 20px',
		margin: 0,
	})
);

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

interface TableDataHeaderProps {
	align?: 'left' | 'right' | 'center';
	fixedWidthRem?: number;
}

export const StyledTableDataHeader = styled.th<TableDataHeaderProps>(
	({ theme, align = 'left', fixedWidthRem }) => ({
		textAlign: align,
		height: 20,
		padding: 8,
		':first-of-type': {
			paddingLeft: 20,
		},
		':last-of-type': {
			paddingRight: 20,
		},
		...(fixedWidthRem && {
			width: `${fixedWidthRem}rem`,
		}),
		textTransform: 'capitalize',
	})
);

export interface TableProps {
	renderHeaders?: () => ReactNode;
	renderData?: () => ReactNode;
	itemCount?: number;
	handleLoadMore?: () => void;
}

const Table = (props: TableProps) => {
	const { renderData, renderHeaders, itemCount, handleLoadMore } =
		props;

	const showLoadMore = (itemCount || 0) > 10;

	return (
		<>
			<PaginationContainer>
				<BodyText size={3} variation='darkGray'>
					{formatNumber(itemCount || 0)} plays
				</BodyText>
			</PaginationContainer>
			<TableContainer>
				<StyledTable>
					{renderHeaders && <TableHead>{renderHeaders()}</TableHead>}
					{renderData && <TableBody>{renderData()}</TableBody>}
				</StyledTable>
			</TableContainer>
			{showLoadMore && (
				<ButtonContainer>
					<Button
						color={'secondaryRed'}
						onClick={handleLoadMore && handleLoadMore}
					>
						Load more
					</Button>
				</ButtonContainer>
			)}
		</>
	);
};

export default Table;

import React, { ReactNode } from 'react';
import styled from 'styled-components';
import {
	BodyText,
	FlexRow,
	TableBody,
	TableHead,
} from '../../components';
import { VISIBLE_TABLE_DATA_LENGTH } from '../../utils/constants';
import { formatNumber } from '../../utils/formatters';

export const TableContainer = styled.div(({ theme }) =>
	theme.withMedia({
		overflowX: 'auto',
	})
);

const StyledTable = styled.table(({ theme }) =>
	theme.withMedia({
		width: '100%',
		position: 'relative',
		borderCollapse: 'collapse',
	})
);

const PaginationContainer = styled(FlexRow)(({ theme }) =>
	theme.withMedia({
		height: 48,
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: '12px 20px',
		margin: 0,
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
	renderFooterButton?: () => ReactNode;
	itemCount?: number;
	itemsLabel?: string;
}

export const Table = (props: TableProps) => {
	const {
		renderData,
		renderHeaders,
		renderFooterButton,
		itemCount,
		itemsLabel = 'play',
	} = props;

	return (
		<>
			<PaginationContainer>
				<BodyText size={3} variation='darkGray'>
					{formatNumber(itemCount || 0)} {itemsLabel}
					{(itemCount || 0) > 1 ? 's' : ''}
				</BodyText>
			</PaginationContainer>
			<TableContainer>
				<StyledTable>
					{renderHeaders && <TableHead>{renderHeaders()}</TableHead>}
					{renderData && <TableBody>{renderData()}</TableBody>}
				</StyledTable>
			</TableContainer>
			{renderFooterButton &&
				(itemCount || 0) > VISIBLE_TABLE_DATA_LENGTH &&
				renderFooterButton()}
		</>
	);
};

export default Table;

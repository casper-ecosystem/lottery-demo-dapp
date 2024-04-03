import React from 'react';

import styled from 'styled-components';

/* eslint-disable-next-line */
export interface TableHeadProps {}

const StyledTableHead = styled.thead(({ theme }) => ({
	background: theme.styleguideColors.fillSecondary,
	color: theme.contentPrimary,
	fontWeight: 600,
	height: 40,
	display: 'table-cell',
	padding: 8,
	textAlign: 'left',
	':first-of-type': {
		paddingLeft: 20,
	},
	':last-of-type': {
		paddingRight: 20,
	},
}));

export function TableHead(props: TableHeadProps) {
	return <StyledTableHead {...props} />;
}

export default TableHead;

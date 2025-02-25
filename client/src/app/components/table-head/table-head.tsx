import React from 'react';

import styled from 'styled-components';

const StyledTableHead = styled.thead(({ theme }) => ({
	background: theme.styleguideColors.fillSecondary,
	height: 40,
}));

export function TableHead(props: any) {
	return <StyledTableHead {...props} />;
}

export default TableHead;

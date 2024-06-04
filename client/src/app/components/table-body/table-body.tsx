import React from 'react';

import styled from 'styled-components';

const StyledTableBody = styled.tbody``;

export function TableBody(props: any) {
	return <StyledTableBody {...props} />;
}

export default TableBody;

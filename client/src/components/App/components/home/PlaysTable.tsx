import styled from 'styled-components';
import TableBody from './table/table-body';
import TableData from './table/table-data';
import TableHead from './table/table-head';
import TableRow from './table/table-row';
import PlaysTableHeader from './table/PlaysTableHeader';
import PlaysTableData from './table/PlaysTableData';

const StyledTableContainer = styled.table(({ theme }) =>
	theme.withMedia({
		width: '100%',
		borderSpacing: 0,
	})
);

export default function PlaysTable() {
	return (
		<StyledTableContainer>
			<PlaysTableHeader></PlaysTableHeader>
			<PlaysTableData></PlaysTableData>
		</StyledTableContainer>
	);
}

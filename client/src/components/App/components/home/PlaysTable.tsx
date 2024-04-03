import styled from 'styled-components';
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
			<tbody>
				<PlaysTableData></PlaysTableData>
			</tbody>
		</StyledTableContainer>
	);
}

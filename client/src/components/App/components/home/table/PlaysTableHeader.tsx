import styled from 'styled-components';
import TableRow from './table-row';

const StyledTableHead = styled.thead(({ theme }) => ({
	background: theme.styleguideColors.fillSecondary,
	color: theme.contentPrimary,
	fontWeight: 600,
	height: 40,
	display: 'table-header-group',
}));

const StyledTh = styled.th(({ theme }) =>
	theme.withMedia({
		padding: 8,
		textAlign: 'left',
		':first-of-type': {
			paddingLeft: 20,
		},
		':last-of-type': {
			paddingRight: 20,
		},
	})
);

export default function PlaysTableHeader() {
	return (
		<StyledTableHead>
			<TableRow>
				<StyledTh>Player</StyledTh>
				<StyledTh>Prize</StyledTh>
				<StyledTh>Time</StyledTh>
			</TableRow>
		</StyledTableHead>
	);
}

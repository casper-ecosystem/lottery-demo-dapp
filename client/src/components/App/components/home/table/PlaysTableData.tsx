import styled from 'styled-components';
import TableRow from './table-row';
import StyledIdenticon from './StyledIdenticon';
import Identicon from 'react-identicons';

const StyledTableData = styled.td(({ theme }) =>
	theme.withMedia({
		height: 48,
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

const StyledIdentifier = styled.div(({ theme }) =>
	theme.withMedia({
		display: 'flex',
		alignItems: 'center',
		span: {
			marginLeft: '10px',
		},
	})
);

export default function PlaysTableData() {
	return (
		<>
			<TableRow>
				<StyledTableData>
					<StyledIdentifier>
						<StyledIdenticon size={32} string='test' />
						<span>Account hashneoifnoenfnef</span>
					</StyledIdentifier>
				</StyledTableData>
				<StyledTableData>123456789 CSPR</StyledTableData>
				<StyledTableData>04-02-24 11:24:19</StyledTableData>
			</TableRow>
		</>
	);
}

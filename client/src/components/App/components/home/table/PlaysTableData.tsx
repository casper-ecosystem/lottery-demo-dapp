import styled from 'styled-components';
import TableBody from './table-body';
import TableData from './table-data';
import TableHead from './table-head';
import TableRow from './table-row';
import StyledIdenticon from './StyledIdenticon';
import Identicon from 'react-identicons';

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
				<TableData>
					<StyledIdentifier>
						<StyledIdenticon size={32} string='test' />
						<span>Account hashneoifnoenfnef</span>
					</StyledIdentifier>
				</TableData>
				<TableData>123456789 CSPR</TableData>
				<TableData>04-02-24 11:24:19</TableData>
			</TableRow>
		</>
	);
}

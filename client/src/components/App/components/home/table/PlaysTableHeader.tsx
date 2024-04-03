import styled from 'styled-components';
import TableBody from './table-body';
import TableData from './table-data';
import TableHead from './table-head';
import TableRow from './table-row';

export default function PlaysTableHeader() {
	return (
		<>
			<TableRow>
				<TableHead>Player</TableHead>
				<TableHead>Prize</TableHead>
				<TableHead>Time</TableHead>
			</TableRow>
		</>
	);
}

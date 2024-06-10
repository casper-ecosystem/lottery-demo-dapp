import { BodyText, TableRow } from '../../components';
import { StyledTableDataHeader } from '../../components';

const JackpotsDataHeaders = () => (
	<TableRow>
		<StyledTableDataHeader fixedWidthRem={17}>
			<BodyText size={1} scale={'xs'}>
				Round
			</BodyText>
		</StyledTableDataHeader>

		<StyledTableDataHeader fixedWidthRem={14}>
			<BodyText size={1} scale={'xs'}>
				Winner
			</BodyText>
		</StyledTableDataHeader>

		<StyledTableDataHeader align={'right'} fixedWidthRem={16.4}>
			<BodyText size={1} scale={'xs'}>
				Lottery pool
			</BodyText>
		</StyledTableDataHeader>
		<StyledTableDataHeader />

		<StyledTableDataHeader fixedWidthRem={18}>
			<BodyText size={1} scale={'xs'}>
				Ended
			</BodyText>
		</StyledTableDataHeader>
	</TableRow>
);

export default JackpotsDataHeaders;

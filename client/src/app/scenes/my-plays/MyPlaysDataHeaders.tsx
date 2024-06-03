import { BodyText, TableRow } from '@make-software/cspr-ui';
import { StyledTableDataHeader } from '../../components';

const MyPlaysDataHeaders = () => (
	<TableRow>
		<StyledTableDataHeader fixedWidthRem={22}>
			<BodyText size={1} scale={'xs'}>
				Round
			</BodyText>
		</StyledTableDataHeader>

		<StyledTableDataHeader align={'right'} fixedWidthRem={20}>
			<BodyText size={1} scale={'xs'}>
				Prize
			</BodyText>
		</StyledTableDataHeader>
		<StyledTableDataHeader />

		<StyledTableDataHeader fixedWidthRem={16}>
			<BodyText size={1} scale={'xs'}>
				Time
			</BodyText>
		</StyledTableDataHeader>
	</TableRow>
);

export default MyPlaysDataHeaders;

import { BodyText, TableRow } from '@make-software/cspr-ui';
import { StyledTableDataHeader } from '../../components';

const PlaysDataHeaders = () => (
	<TableRow>
		<StyledTableDataHeader fixedWidthRem={28}>
			<BodyText size={1} scale={'xs'}>
				Player
			</BodyText>
		</StyledTableDataHeader>

		<StyledTableDataHeader align={'right'}>
			<BodyText size={1} scale={'xs'}>
				Prize
			</BodyText>
		</StyledTableDataHeader>

		<StyledTableDataHeader fixedWidthRem={14} />

		<StyledTableDataHeader fixedWidthRem={15}>
			<BodyText size={1} scale={'xs'}>
				Time
			</BodyText>
		</StyledTableDataHeader>
	</TableRow>
);

export default PlaysDataHeaders;

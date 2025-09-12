import { StyledTableDataHeader } from '../../components';

import { BodyText, TableRow } from '@make-software/cspr-design';

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

		<StyledTableDataHeader fixedWidthRem={12} />

		<StyledTableDataHeader fixedWidthRem={20}>
			<BodyText size={1} scale={'xs'}>
				Time
			</BodyText>
		</StyledTableDataHeader>
	</TableRow>
);

export default PlaysDataHeaders;

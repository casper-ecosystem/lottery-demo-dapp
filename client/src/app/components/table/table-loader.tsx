import React from 'react';
import Table from './table';
import { TableRow, TableData } from '../../components';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

type Props = {
	columnsLength: number;
	rowsLength?: number;
};

export const TableLoader = ({
	columnsLength,
	rowsLength = 10,
}: Props) => {
	const tableData = Array(rowsLength).fill(undefined);
	const columnsRow = Array(columnsLength).fill(null);

	return (
		<Table
			renderData={() =>
				tableData.map((item, index) => (
					<TableRow key={'row' + index} loading>
						{columnsRow.map((item2, index2) => (
							<TableData key={'column' + index2}>
								<Skeleton />
							</TableData>
						))}
					</TableRow>
				))
			}
		/>
	);
};

export default TableLoader;

import { useEffect, useState } from 'react';
import axios from 'axios';
import { VISIBLE_TABLE_DATA_LENGTH } from '../../utils/constants';

interface InitialState {
	data: null;
	loading: boolean;
	error: string | null;
	total: number;
}

interface GetTableDataProps {
	url: string;
}

interface GetTableDataType<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
	total: number;
	loadAllData: () => void;
	resetLimit: () => void;
}

export const useGetTableData = <T>({
	url,
}: GetTableDataProps): GetTableDataType<T> => {
	const [limit, setLimit] = useState(10);
	const [state, setState] = useState<InitialState>({
		data: null,
		loading: true,
		error: null,
		total: 0,
	});

	const fetchData = async () => {
		axios
			.get(`${config.lottery_api_url}${url}`, {
				params: { pageSize: limit },
			})
			.then(response => {
				setState({
					data: response.data.data,
					error: null,
					loading: false,
					total: response.data.total,
				});
			})
			.catch(error =>
				setState({
					...state,
					data: null,
					error: error as string,
					loading: false,
				})
			);
	};

	useEffect(() => {
		fetchData();
	}, [limit]);

	const loadAllData = () => {
		setLimit(1000);
	};

	const resetLimit = () => {
		setLimit(VISIBLE_TABLE_DATA_LENGTH);
	};

	return {
		...state,
		loadAllData,
		resetLimit,
	};
};

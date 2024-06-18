import { useEffect, useState, useCallback } from 'react';
import axios, { AxiosError } from 'axios';
import { VISIBLE_TABLE_DATA_LENGTH } from '../../utils/constants';

interface InitialState {
	data: null;
	loading: boolean;
	error: AxiosError<string> | null;
	total: number;
}

interface GetTableDataProps {
	url: string | null;
	params?: Record<string, string>;
}

interface GetTableDataType<T> {
	data: T | null;
	loading: boolean;
	error: AxiosError<string> | null;
	total: number;
	loadAllData: () => void;
	resetLimit: () => void;
	reloadData: () => void;
}

export const useGetTableData = <T>({
	url,
	params,
}: GetTableDataProps): GetTableDataType<T> => {
	const [pageSize, setPageSize] = useState(10);
	const [requestCounter, setRequestCounter] = useState(0);
	const [state, setState] = useState<InitialState>({
		data: null,
		loading: true,
		error: null,
		total: 0,
	});

	const reloadData = useCallback(() => {
		setRequestCounter(state => state + 1);
	}, []);

	const fetchData = async () => {
		axios
			.get(`${config.lottery_api_url}${url}`, {
				params: { pageSize, ...params },
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
					error: error,
					loading: false,
				})
			);
	};

	useEffect(() => {
		if (url) {
			fetchData();
		}
	}, [pageSize, url, requestCounter]);

	const loadAllData = () => {
		setPageSize(-1);
	};

	const resetLimit = () => {
		setPageSize(VISIBLE_TABLE_DATA_LENGTH);
	};

	return {
		...state,
		loadAllData,
		resetLimit,
		reloadData,
	};
};

import { useEffect, useState } from 'react';
import axios from 'axios';

interface InitialState {
	data: any[] | null;
	loading: boolean;
	error: string | null;
	total: number;
}

interface UseFetchProps {
	url: string;
	limit: number;
}

export const useFetch = ({ url, limit }: UseFetchProps) => {
	const [state, setState] = useState<InitialState>({
		data: null,
		loading: true,
		error: null,
		total: 0,
	});

	const fetchData = async () => {
		axios
			.get(`${config.lottery_api_url}${url}`, {
				params: { limit: limit, offset: 0 },
			})
			.then(response => {
				setState({
					// @ts-ignore
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
	}, []);

	return {
		...state,
	};
};

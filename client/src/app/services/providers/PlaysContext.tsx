import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	ReactNode,
} from 'react';
import { Play } from '../../types';
import { useGetTableData } from '../hooks/use-get-table-data';
import { AxiosError } from 'axios';

type PlayContextType = {
	plays: Play[];
	loading: boolean;
	error: AxiosError<string> | null;
	total: number;
	loadAllData: () => void;
	resetLimit: () => void;
	reloadPlaysData: () => void;
};

const PlaysContext = createContext<PlayContextType | undefined>(
	undefined
);

export function usePlaysData() {
	const context = useContext(PlaysContext);
	if (context === undefined) {
		throw new Error(
			'usePlaysData must be used within a PlaysProvider'
		);
	}
	return context;
}

type PlaysProviderProps = {
	children: ReactNode;
};

type PlaysState = {
	plays: Play[];
	loading: boolean;
	error: AxiosError<string> | null;
	total: number;
};

export const PlaysProvider: React.FC<PlaysProviderProps> = ({
	children,
}) => {
	const [playsState, setPlaysState] = useState<PlaysState>({
		plays: [],
		loading: false,
		error: null,
		total: 0,
	});

	const tableData = useGetTableData<Play[]>({
		url: '/rounds/latest/plays',
	});

	useEffect(() => {
		if (tableData.data) {
			setPlaysState({
				...playsState,
				plays: tableData.data,
				total: tableData.total,
			});
		}
	}, [tableData.data]);

	const reloadPlaysData = () => {
		tableData.reloadData();
	};

	return (
		<PlaysContext.Provider
			value={{ ...tableData, ...playsState, reloadPlaysData }}
		>
			{children}
		</PlaysContext.Provider>
	);
};

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Play } from '../../../../play.interface';
import { getCurrentJackpot } from '../../../../casper-helper';

type PlayContextType = {
	plays: Play[];
	totalPlays: number;
	getAndSetPlays: () => void;
	addPlay: (play: Play) => void;
	jackpot: number;
	getAndSetJackpot: () => void;
};

const PlaysContext = createContext<PlayContextType | undefined>(undefined);

export function usePlays() {
	const context = useContext(PlaysContext);
	if (context === undefined) {
		throw new Error('usePlays must be used within a PlaysProvider');
	}
	return context;
}

type PlaysProviderProps = {
	children: ReactNode;
};

export const PlaysProvider: React.FC<PlaysProviderProps> = ({ children }) => {
	const [plays, setPlays] = useState<Play[]>([]);
	const [totalPlays, setTotalPlays] = useState<number>(0);
	const [jackpot, setJackpot] = useState<number>(0);

	function getAndSetPlays() {
		axios
			.get(`${config.lottery_api_url}/plays`, { params: { limit: 10, offset: 0 } })
			.then(value => {
				setPlays(value.data.data as Play[]);
				setTotalPlays(value.data.total);
			})
			.catch(error => console.error(error));
	}

	function getAndSetJackpot() {
		getCurrentJackpot()
			.then(jp => {
				setJackpot(jp);
			})
			.catch(error => console.error(error));
	}

	function addPlay(play: Play) {
		setPlays(prevPlays => {
			const updatedPlays = [play, ...prevPlays];
			if (updatedPlays.length > 10) {
				return updatedPlays.slice(0, 10);
			}
			return updatedPlays;
		});
	}

	useEffect(() => {
		getAndSetPlays();
		getAndSetJackpot();
	}, []);

	return (
		<PlaysContext.Provider value={{ plays, totalPlays, getAndSetPlays, addPlay, jackpot, getAndSetJackpot }}>
			{children}
		</PlaysContext.Provider>
	);
};

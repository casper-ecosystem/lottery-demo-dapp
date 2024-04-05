import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Play } from '../../../../play.interface';

type PlayContextType = {
	plays: Play[];
	getAndSetPlays: () => void;
	addPlay: (play: Play) => void;
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

	function getAndSetPlays() {
		axios
			.get('http://localhost:3001/plays', { params: { limit: 10, offset: 0 } })
			.then(value => {
				setPlays(value.data.data as Play[]);
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
	}, []);

	return <PlaysContext.Provider value={{ plays, getAndSetPlays, addPlay }}>{children}</PlaysContext.Provider>;
};

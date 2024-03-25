import { CustomTopBarMenuItem, CustomTopBarMenuSettings } from '@make-software/csprclick-ui';

enum Loc {
	HOME,
	ABOUT,
	JACKPOTS,
}

export const Locations: Loc[] = [Loc.HOME, Loc.ABOUT, Loc.JACKPOTS];

export const homeSettings = (location: string, setLocation: (loc: string) => void) => {
	return {
		items: ['Test'],
		onItemSwitch: (n: string) => {
			setLocation(n);
			console.log(`Switched location to ${n}.`);
		},
		currentItem: location,
	} as CustomTopBarMenuSettings;
};

export const homeSetting = (location: string) => {
	return {
		title: location,
	} as CustomTopBarMenuItem;
};

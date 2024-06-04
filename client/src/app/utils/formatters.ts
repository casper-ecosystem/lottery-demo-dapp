import { createIntl, createIntlCache } from '@formatjs/intl';
const cache = createIntlCache();
const intl = createIntl(
	{
		locale: 'en-US',
		messages: {
			'components.transaction_status': 'Success',
		},
	},
	cache
);

export const formatNumber = (
	value: number | string,
	{
		precision,
		notation,
		compactDisplay,
	}: {
		precision?: number;
		notation?: 'compact' | 'standard';
		compactDisplay?: 'short' | 'long';
	} = {}
): string => {
	return intl.formatNumber(value as number, {
		minimumFractionDigits: precision || 0,
		maximumFractionDigits: precision || 0,
		notation,
		compactDisplay,
	});
};

export enum HashLength {
	FULL = 0,
	TINY = 5,
	LITTLE = 10,
	SMALL = 15,
	MEDIUM = 20,
	LARGE = 25,
}

export const formatHash = (
	hash: string,
	visibleHashLength: HashLength = HashLength.TINY
) => {
	const MIN_TRUNCATE_HASH_LENGTH = HashLength.TINY * 2 + 3;

	const [hashWithoutSuffix, lastDigits] = hash.split('-');

	const hashLength = hashWithoutSuffix.length;

	if (
		visibleHashLength === HashLength.FULL ||
		hashLength <= MIN_TRUNCATE_HASH_LENGTH
	) {
		return hash;
	}

	const firstPart = hashWithoutSuffix.substring(0, visibleHashLength);
	const secondPart = hashWithoutSuffix.substring(
		hashLength - visibleHashLength
	);

	const truncatedHash = `${firstPart}...${secondPart}`;

	return lastDigits
		? `${truncatedHash}-${lastDigits}`
		: `${truncatedHash}`;
};

export const formatIsoTimestamp = (value: string): string => {
	const [date, time] = value.split('T');

	return `${date} ${time.split('.')[0]}`;
};

const isJSON = (str: string) => {
	try {
		JSON.parse(str);
	} catch (e) {
		return false;
	}
	return true;
};

export const isDeploy = (message: string) => {
	if (isJSON(message)) {
		const value = JSON.parse(message);
		return !!value?.data?.deploy_hash;
	}
	return false;
};

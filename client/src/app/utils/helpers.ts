export const ONE_CSPR = 1_000_000_000;

export const VISIBLE_TABLE_DATA_LENGTH = 10;

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

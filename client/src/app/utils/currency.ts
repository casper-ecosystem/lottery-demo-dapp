import Big from 'big.js';
import { MOTES_PER_CSPR_RATE } from './constants';

export const motesToCSPR = (motes: string): string => {
	return Big(motes).div(MOTES_PER_CSPR_RATE).toString();
};

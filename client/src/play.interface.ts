export interface Play {
	playId: string;
	roundId: string;
	playerAccountHash: string;
	playerPublicKey: string;
	prizeAmount: string;
	isJackpot: boolean;
	deployHash: string;
	timestamp: string;
}

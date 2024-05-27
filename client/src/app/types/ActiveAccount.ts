export type ActiveAccountType = {
	balance: string;
	connected_at: number;
	last_used: number;
	liquid_balance: string;
	logo: string | undefined;
	name: string | null;
	provider: string;
	public_key: string;
	token: string | null;
};

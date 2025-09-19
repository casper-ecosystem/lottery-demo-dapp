export interface Transaction {
	deploy_hash: string;
	block_hash: string;
	block_height: number;
	caller_public_key: string;
	execution_type_id: number;
	contract_package_hash: string | null;
	contract_hash: string | null;
	entry_point_id: string | null;
	payment_amount: string;
	cost: string;
	error_message: string | null;
	status: string;
	timestamp: string;
}

export interface TransactionMessage {
	data: Transaction;
	action: string;
	extra: null;
	timestamp: string;
}

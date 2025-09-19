import {
	Args,
	CLTypeUInt8,
	CLValue,
	Hash,
	PublicKey,
	SessionBuilder,
	Transaction,
} from 'casper-js-sdk';
import axios from 'axios';
import { CSPRToMotes } from '../../utils/currency';

export enum TransactionFailed {
	Failed,
}

export const getProxyWASM = async (): Promise<Uint8Array> => {
	const result = await fetch(`${config.lottery_api_url}/proxy-wasm`);
	if (!result.ok) {
		throw new Error(await result.text());
	}
	const buffer = await result.arrayBuffer();
	return new Uint8Array(buffer);
};

export const preparePlayTransaction = async (
	playerPublicKey: PublicKey
): Promise<Transaction> => {
	const args_bytes: Uint8Array = Args.fromMap({}).toBytes();

	const serialized_args = CLValue.newCLList(CLTypeUInt8,
		Array.from(args_bytes)
			.map(value => CLValue.newCLUint8(value))
	);

	const priceInMotes = CSPRToMotes(config.lottery_ticket_price_in_cspr);

	const args = Args.fromMap({
		amount: CLValue.newCLUInt512(priceInMotes),
		attached_value: CLValue.newCLUInt512(priceInMotes),
		entry_point: CLValue.newCLString("play_lottery"),
		contract_package_hash: CLValue.newCLByteArray(Hash.fromHex(config.lottery_app_contract_package_hash).toBytes()),
		args: serialized_args,
	});

	const paymentInMotes = CSPRToMotes(config.gas_price_in_cspr);
	const wasm = await getProxyWASM();

	const sessionTx = new SessionBuilder()
		.from(playerPublicKey)
		.runtimeArgs(args)
		.wasm(wasm)
		.payment(paymentInMotes)
		.chainName(config.cspr_chain_name)
		.build();

	return sessionTx;
};

export const getLastPlayByAccountHash = async (
	accountHash: string
) => {
	const response = await axios.get(
		`${config.lottery_api_url}/players/${accountHash}/plays`,
		{
			params: { pageSize: 1 },
		}
	);

	return response.data;
};

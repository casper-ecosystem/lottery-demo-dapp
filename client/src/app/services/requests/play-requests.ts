import {
	CasperClient,
	CLByteArray,
	CLList,
	CLPublicKey,
	CLU8,
	CLValueBuilder,
	Contracts,
	csprToMotes,
	decodeBase16,
	DeployUtil,
	RuntimeArgs,
} from 'casper-js-sdk';
import { Deploy } from 'casper-js-sdk/dist/lib/DeployUtil';
import axios from 'axios';

export enum DeployFailed {
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

export const preparePlayDeploy = async (
	publicKey: CLPublicKey
): Promise<Deploy> => {
	const contractPackageHashBytes = new CLByteArray(
		decodeBase16(config.lottery_app_contract_package_hash)
	);
	const args_bytes: Uint8Array = RuntimeArgs.fromMap({})
		.toBytes()
		.unwrap();

	const serialized_args = new CLList(
		Array.from(args_bytes).map(value => new CLU8(value))
	);

	const casperClient = new CasperClient('');
	const contractClient = new Contracts.Contract(casperClient);

	const amount = CLValueBuilder.u512(
		csprToMotes(config.lottery_ticket_price_in_cspr)
	);

	const args = RuntimeArgs.fromMap({
		attached_value: amount,
		amount: amount,
		entry_point: CLValueBuilder.string('play_lottery'),
		contract_package_hash: contractPackageHashBytes,
		args: serialized_args,
	});

	const wasm = await getProxyWASM();

	return contractClient.install(
		wasm,
		args,
		csprToMotes(config.gas_price_in_cspr).toString(),
		publicKey,
		config.cspr_chain_name
	);
};

export const signAndSendDeploy = async (
	deploy: Deploy,
	publicKey: CLPublicKey,
	onStatusUpdate: (status: string, data: any) => void
) => {

	const deployJson = DeployUtil.deployToJson(deploy);
	const response = await window.csprclick.send(
		JSON.stringify(deployJson.deploy),
		publicKey.toHex().toLowerCase(),
		onStatusUpdate
	);

	if (response?.cancelled) {
		throw new Error('A deploy was not signed');
	}

	return response;
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

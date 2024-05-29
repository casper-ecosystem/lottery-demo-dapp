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

	const args = RuntimeArgs.fromMap({
		attached_value: CLValueBuilder.u512(csprToMotes(50)), // Should be configural
		amount: CLValueBuilder.u512(csprToMotes(50)),
		entry_point: CLValueBuilder.string('play_lottery'),
		contract_package_hash: contractPackageHashBytes,
		args: serialized_args,
	});

	const wasm = await getProxyWASM();

	return contractClient.install(
		wasm,
		args,
		csprToMotes(10).toString(), // Make this contextual
		publicKey,
		'casper-test' // Make this configural
	);
};

export const signAndSendDeploy = async (
	deploy: Deploy,
	publicKey: CLPublicKey
) => {
	const deployJson = DeployUtil.deployToJson(deploy);
	await window.csprclick.send(
		JSON.stringify(deployJson.deploy),
		publicKey.toHex().toLowerCase()
	);
};

export const getLastPlayByAccountHash = async (
	accountHash: string
) => {
	const response = await axios.get(
		`${config.lottery_api_url}/players/${accountHash}/plays`,
		{
			params: { limit: 1 },
		}
	);

	return response.data;
};

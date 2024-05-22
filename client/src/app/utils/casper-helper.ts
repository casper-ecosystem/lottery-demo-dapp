import {
	RuntimeArgs,
	CasperClient,
	Contracts,
	CLPublicKey,
	DeployUtil,
	CLValueBuilder,
	csprToMotes,
	CLByteArray,
	decodeBase16,
	CLList,
	CLU8,
} from 'casper-js-sdk';
import { Deploy } from 'casper-js-sdk/dist/lib/DeployUtil';
import axios from 'axios';

export enum DeployFailed {
	Failed,
}

export const ONE_CSPR = 1_000_000_000;

async function getProxyWASM(): Promise<Uint8Array> {
	const result = await fetch(`${config.lottery_api_url}/proxy-wasm`);
	if (!result.ok) {
		throw new Error(await result.text());
	}
	const buffer = await result.arrayBuffer();
	return new Uint8Array(buffer);
}

export async function preparePlayDeploy(
	publicKey: CLPublicKey
): Promise<Deploy> {
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
}

export async function signAndSendDeploy(
	deploy: Deploy,
	publicKey: CLPublicKey
) {
	const deployJson = DeployUtil.deployToJson(deploy);
	await window.csprclick.send(
		JSON.stringify(deployJson.deploy),
		publicKey.toHex().toLowerCase()
	);
}

export async function initiateDeployListener(publicKey: CLPublicKey) {
	const result = await fetch(
		`${
			config.lottery_api_url
		}/initDeployListener?publicKey=${publicKey.toHex()}`
	);
	if (!result.ok) {
		throw new Error(await result.text());
	}
}

export async function getPlayByDeployHash(deployHash: string) {
	return axios.get(`${config.lottery_api_url}/playByDeployHash`, {
		params: { deployHash: deployHash },
	});
}

export const formatIsoTimestamp = (value: string): string => {
	const [date, time] = value.split('T');

	return `${date} ${time.split('.')[0]}`;
};

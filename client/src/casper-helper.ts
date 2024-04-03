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
import { Deploy, DeployJson } from 'casper-js-sdk/dist/lib/DeployUtil';
import { JsonTypes } from 'typedjson';

const CONTRACT_PACKAGE_HASH = '40777e199af2ae4756c2a148c24e79885dc062fe4428adf23212dd04fd73187b';
const CONTRACT_HASH = 'hash-1ef74bd21a7bd5352f50202e3d40352a0c209d90114eceee4be6f3c8d4e78998';

async function getProxyWASM(): Promise<Uint8Array> {
	const result = await fetch('http://localhost:3001/getProxyWASM');
	if (!result.ok) {
		throw new Error(await result.text());
	}
	const buffer = await result.arrayBuffer();
	return new Uint8Array(buffer);
}

export async function preparePlayDeploy(publicKey: CLPublicKey): Promise<Deploy> {
	const contractPackageHashBytes = new CLByteArray(decodeBase16(CONTRACT_PACKAGE_HASH));
	const args_bytes: Uint8Array = RuntimeArgs.fromMap({}).toBytes().unwrap();
	const serialized_args = new CLList(Array.from(args_bytes).map(value => new CLU8(value)));
	const casperClient = new CasperClient('');
	const contractClient = new Contracts.Contract(casperClient);
	const args = RuntimeArgs.fromMap({
		attached_value: CLValueBuilder.u512(csprToMotes(50)),
		amount: CLValueBuilder.u512(csprToMotes(50)),
		entry_point: CLValueBuilder.string('play_lottery'),
		contract_package_hash: contractPackageHashBytes,
		args: serialized_args,
	});

	const wasm = await getProxyWASM();

	return contractClient.install(
		wasm,
		args,
		csprToMotes(10).toString(), // 4 CSPR - Make this contextual, maybe use spec exec
		publicKey,
		'casper-test' // Make this configural
	);
}

export function signAndSendDeploy(deploy: Deploy, publicKey: CLPublicKey) {
	const deployJson = DeployUtil.deployToJson(deploy);
	window.csprclick.send(JSON.stringify(deployJson.deploy), publicKey.toHex().toLowerCase());
}

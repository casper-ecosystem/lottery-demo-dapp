import { RuntimeArgs, CasperClient, Contracts, CLPublicKey, DeployUtil, CLValueBuilder, csprToMotes } from "casper-js-sdk";
import { Deploy, DeployJson } from "casper-js-sdk/dist/lib/DeployUtil";
import { JsonTypes } from "typedjson";

const CONTRACT_PACKAGE_HASH = ""
const CONTRACT_HASH = "hash-1ef74bd21a7bd5352f50202e3d40352a0c209d90114eceee4be6f3c8d4e78998"

async function getProxyWASM(): Promise<Uint8Array> {
    const result = await fetch(
      "http://localhost:3001/getProxyWASM"
    );
    if (!result.ok) {
      throw new Error(await result.text());
    }
    const buffer = await result.arrayBuffer();
    return new Uint8Array(buffer);
  }

export async function preparePlayDeploy(publicKey: CLPublicKey): Promise<Deploy> {
    const casperClient = new CasperClient("");
    const contractClient = new Contracts.Contract(casperClient);
    const args = RuntimeArgs.fromMap({
        amount: CLValueBuilder.u512(csprToMotes(50))
    });

    let wasm = await getProxyWASM();

    return contractClient.install(
        wasm,
        args,
        csprToMotes(10).toString(), // 4 CSPR - Make this contextual, maybe use spec exec
        publicKey,
        "casper-test", // Make this configural
    );
}

export function signAndSendDeploy(deploy: Deploy, publicKey: CLPublicKey) {
    const deployJson = DeployUtil.deployToJson(deploy);
    window.csprclick.send(JSON.stringify(deployJson.deploy), publicKey.toHex().toLowerCase())
}
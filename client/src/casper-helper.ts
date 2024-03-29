import { RuntimeArgs, CasperClient, Contracts, CLPublicKey, DeployUtil } from "casper-js-sdk";
import { Deploy, DeployJson } from "casper-js-sdk/dist/lib/DeployUtil";
import { JsonTypes } from "typedjson";
import { CSPRClickSDK } from "@make-software/csprclick-core-client";

const CONTRACT_PACKAGE_HASH = ""
const CONTRACT_HASH = "hash-1ef74bd21a7bd5352f50202e3d40352a0c209d90114eceee4be6f3c8d4e78998"


export function preparePlayDeploy(publicKey: CLPublicKey): Deploy {
    // Look into using useContext for CasperClient / ContractClient
    const casperClient = new CasperClient("http://NODE_ADDRESS:7777/rpc");
    const contractClient = new Contracts.Contract(casperClient);
    contractClient.setContractHash(CONTRACT_HASH);
    const args = RuntimeArgs.fromMap({});

    return contractClient.callEntrypoint(
        "apply",
        args,
        publicKey,
        "casper-test", // Make this contextual
        "4000000000" // 4 CSPR - Make this contextual, maybe use spec exec
    );
}

export function signAndSendDeploy(deploy: Deploy, publicKey: CLPublicKey) {
    const deployJson = DeployUtil.deployToJson(deploy);
    const csprClickSDK = new CSPRClickSDK();
    csprClickSDK.send(JSON.stringify(deployJson), publicKey.toHex())
}
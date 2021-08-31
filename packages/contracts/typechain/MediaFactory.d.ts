import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import type { Media } from "./Media";
export declare class MediaFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides): Promise<Media>;
    getDeployTransaction(overrides?: Overrides): TransactionRequest;
    attach(address: string): Media;
    connect(signer: Signer): MediaFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): Media;
}

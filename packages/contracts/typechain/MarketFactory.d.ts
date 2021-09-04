import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import type { Market } from "./Market";
export declare class MarketFactory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(overrides?: Overrides): Promise<Market>;
    getDeployTransaction(overrides?: Overrides): TransactionRequest;
    attach(address: string): Market;
    connect(signer: Signer): MarketFactory;
    static connect(address: string, signerOrProvider: Signer | Provider): Market;
}

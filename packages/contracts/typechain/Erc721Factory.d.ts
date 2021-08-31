import { Signer } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import type { Erc721 } from "./Erc721";
export declare class Erc721Factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(name: string, symbol: string, overrides?: Overrides): Promise<Erc721>;
    getDeployTransaction(name: string, symbol: string, overrides?: Overrides): TransactionRequest;
    attach(address: string): Erc721;
    connect(signer: Signer): Erc721Factory;
    static connect(address: string, signerOrProvider: Signer | Provider): Erc721;
}

import { Signer, BigNumberish } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import { ContractFactory, Overrides } from "@ethersproject/contracts";
import type { BaseErc20 } from "./BaseErc20";
export declare class BaseErc20Factory extends ContractFactory {
    constructor(signer?: Signer);
    deploy(name: string, symbol: string, decimals: BigNumberish, overrides?: Overrides): Promise<BaseErc20>;
    getDeployTransaction(name: string, symbol: string, decimals: BigNumberish, overrides?: Overrides): TransactionRequest;
    attach(address: string): BaseErc20;
    connect(signer: Signer): BaseErc20Factory;
    static connect(address: string, signerOrProvider: Signer | Provider): BaseErc20;
}

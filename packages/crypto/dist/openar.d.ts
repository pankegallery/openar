import { Ask, Bid, BidShares, EIP712Domain, EIP712Signature, MediaData } from "./types";
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { ContractTransaction } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import { Signer } from "@ethersproject/abstract-signer";
import { Market, Media } from "@openar/contracts";
export declare class OpenAR {
    chainId: number;
    mediaAddress: string;
    marketAddress: string;
    signerOrProvider: Signer | Provider;
    media: Media;
    market: Market;
    readOnly: boolean;
    constructor(signerOrProvider: Signer | Provider, chainId: number, mediaAddress?: string, marketAddress?: string);
    /*********************
     * Zora View Methods
     *********************
     */
    /**
     * Fetches the content hash for the specified media on the Zora Media Contract
     * @param mediaId
     */
    fetchContentHash(mediaId: BigNumberish): Promise<string>;
    /**
     * Fetches the metadata hash for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    fetchMetadataHash(mediaId: BigNumberish): Promise<string>;
    /**
     * Fetches the content uri for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    fetchContentURI(mediaId: BigNumberish): Promise<string>;
    /**
     * Fetches the metadata uri for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    fetchMetadataURI(mediaId: BigNumberish): Promise<string>;
    /**
     * Fetches the creator for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    fetchCreator(mediaId: BigNumberish): Promise<string>;
    /**
     * Fetches the current bid shares for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    fetchCurrentBidShares(mediaId: BigNumberish): Promise<BidShares>;
    /**
     * Fetches the current ask for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    fetchCurrentAsk(mediaId: BigNumberish): Promise<Ask>;
    /**
     * Fetches the current bid for the specified bidder for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     * @param bidder
     */
    fetchCurrentBidForBidder(mediaId: BigNumberish, bidder: string): Promise<Bid>;
    /**
     * Fetches the permit nonce on the specified media id for the owner address
     * @param address
     * @param mediaId
     */
    fetchPermitNonce(address: string, mediaId: BigNumberish): Promise<BigNumber>;
    /**
     * Fetches the current mintWithSig nonce for the specified address
     * @param address
     * @param mediaId
     */
    fetchMintWithSigNonce(address: string): Promise<BigNumber>;
    /*********************
     * Zora Write Methods
     *********************
     */
    /**
     * Updates the content uri for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     * @param tokenURI
     */
    updateContentURI(mediaId: BigNumberish, tokenURI: string): Promise<ContractTransaction>;
    /**
     * Updates the metadata uri for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     * @param metadataURI
     */
    updateMetadataURI(mediaId: BigNumberish, metadataURI: string): Promise<ContractTransaction>;
    /**
     * Mints a new piece of media on an instance of the Zora Media Contract
     * @param mintData
     * @param bidShares
     */
    mint(mediaData: MediaData, bidShares: BidShares): Promise<ContractTransaction>;
    /**
     * Mints a new piece of media on an instance of the Zora Media Contract
     * @param creator
     * @param mediaData
     * @param bidShares
     * @param sig
     */
    mintWithSig(creator: string, mediaData: MediaData, bidShares: BidShares, sig: EIP712Signature): Promise<ContractTransaction>;
    /**
     * Sets an ask on the specified media on an instance of the Zora Media Contract
     * @param mediaId
     * @param ask
     */
    setAsk(mediaId: BigNumberish, ask: Ask): Promise<ContractTransaction>;
    /**
     * Sets a bid on the specified media on an instance of the Zora Media Contract
     * @param mediaId
     * @param bid
     */
    setBid(mediaId: BigNumberish, bid: Bid): Promise<ContractTransaction>;
    /**
     * Removes the ask on the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    removeAsk(mediaId: BigNumberish): Promise<ContractTransaction>;
    /**
     * Removes the bid for the msg.sender on the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    removeBid(mediaId: BigNumberish): Promise<ContractTransaction>;
    /**
     * Accepts the specified bid on the specified media on an instance of the Zora Media Contract
     * @param mediaId
     * @param bid
     */
    acceptBid(mediaId: BigNumberish, bid: Bid): Promise<ContractTransaction>;
    /**
     * Grants the spender approval for the specified media using meta transactions as outlined in EIP-712
     * @param sender
     * @param mediaId
     * @param sig
     */
    permit(spender: string, mediaId: BigNumberish, sig: EIP712Signature): Promise<ContractTransaction>;
    /**
     * Revokes the approval of an approved account for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    revokeApproval(mediaId: BigNumberish): Promise<ContractTransaction>;
    /**
     * Burns the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    burn(mediaId: BigNumberish): Promise<ContractTransaction>;
    /***********************
     * ERC-721 View Methods
     ***********************
     */
    /**
     * Fetches the total balance of media owned by the specified owner on an instance of the Zora Media Contract
     * @param owner
     */
    fetchBalanceOf(owner: string): Promise<BigNumber>;
    /**
     * Fetches the owner of the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    fetchOwnerOf(mediaId: BigNumberish): Promise<string>;
    /**
     * Fetches the mediaId of the specified owner by index on an instance of the Zora Media Contract
     * @param owner
     * @param index
     */
    fetchMediaOfOwnerByIndex(owner: string, index: BigNumberish): Promise<BigNumber>;
    /**
     * Fetches the total amount of non-burned media that has been minted on an instance of the Zora Media Contract
     */
    fetchTotalMedia(): Promise<BigNumber>;
    /**
     * Fetches the mediaId by index on an instance of the Zora Media Contract
     * @param index
     */
    fetchMediaByIndex(index: BigNumberish): Promise<BigNumber>;
    /**
     * Fetches the approved account for the specified media on an instance of the Zora Media Contract
     * @param mediaId
     */
    fetchApproved(mediaId: BigNumberish): Promise<string>;
    /**
     * Fetches if the specified operator is approved for all media owned by the specified owner on an instance of the Zora Media Contract
     * @param owner
     * @param operator
     */
    fetchIsApprovedForAll(owner: string, operator: string): Promise<boolean>;
    /***********************
     * ERC-721 Write Methods
     ***********************
     */
    /**
     * Grants approval to the specified address for the specified media on an instance of the Zora Media Contract
     * @param to
     * @param mediaId
     */
    approve(to: string, mediaId: BigNumberish): Promise<ContractTransaction>;
    /**
     * Grants approval for all media owner by msg.sender on an instance of the Zora Media Contract
     * @param operator
     * @param approved
     */
    setApprovalForAll(operator: string, approved: boolean): Promise<ContractTransaction>;
    /**
     * Transfers the specified media to the specified to address on an instance of the Zora Media Contract
     * @param from
     * @param to
     * @param mediaId
     */
    transferFrom(from: string, to: string, mediaId: BigNumberish): Promise<ContractTransaction>;
    /**
     * Executes a SafeTransfer of the specified media to the specified address if and only if it adheres to the ERC721-Receiver Interface
     * @param from
     * @param to
     * @param mediaId
     */
    safeTransferFrom(from: string, to: string, mediaId: BigNumberish): Promise<ContractTransaction>;
    /****************
     * Miscellaneous
     * **************
     */
    /**
     * Returns the EIP-712 Domain for an instance of the Zora Media Contract
     */
    eip712Domain(): EIP712Domain;
    /**
     * Checks to see if a Bid's amount is evenly splittable given the media's current bidShares
     *
     * @param mediaId
     * @param bid
     */
    isValidBid(mediaId: BigNumberish, bid: Bid): Promise<boolean>;
    /**
     * Checks to see if an Ask's amount is evenly splittable given the media's current bidShares
     *
     * @param mediaId
     * @param ask
     */
    isValidAsk(mediaId: BigNumberish, ask: Ask): Promise<boolean>;
    /**
     * Checks to see if a piece of media has verified uris that hash to their immutable hashes
     *
     * @param mediaId
     * @param timeout
     */
    isVerifiedMedia(mediaId: BigNumberish, timeout?: number): Promise<boolean>;
    /******************
     * Private Methods
     ******************
     */
    /**
     * Throws an error if called on a readOnly == true instance of Zora Sdk
     * @private
     */
    private ensureNotReadOnly;
}
export default OpenAR;

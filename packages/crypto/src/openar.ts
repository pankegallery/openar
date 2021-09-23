import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { ContractTransaction } from "@ethersproject/contracts";
import { Provider } from "@ethersproject/providers";
import { AddressZero } from "@ethersproject/constants";
import { Signer } from "@ethersproject/abstract-signer";

import { BytesLike } from "ethers";
import invariant from "tiny-invariant";
import {
  Market,
  Market__factory,
  Media,
  Media__factory,
} from "@openar/contracts";

import { addresses, mediaContractName } from "./addresses";

import {
  Ask,
  Bid,
  BidShares,
  EIP712Domain,
  EIP712Signature,
  MintData,
  MediaData,
  PlatformCuts,
} from "./types";

import { Decimal } from "./decimal";

import {
  constructMintData,
  isMintDataVerified,
  validateAndParseAddress,
  validateBidShares,
  validateURI,
  nanoidCustom16,
  validateBidOrAsk,
  stringToBytes32,
  generateEIP712Domain,
} from "./utils";

export class OpenAR {
  public chainId: number;

  public mediaAddress: string;

  public marketAddress: string;

  public signerOrProvider: Signer | Provider;

  public media: Media;

  public market: Market;

  public readOnly: boolean;

  constructor(
    signerOrProvider: Signer | Provider,
    chainId: number,
    mediaAddress?: string,
    marketAddress?: string
  ) {
    if (!mediaAddress != !marketAddress) {
      invariant(
        false,
        "openAr Constructor: mediaAddress and marketAddress must both be non-null or both be null"
      );
    }

    // TODO: check if this works ...
    if (Signer.isSigner(signerOrProvider)) {
      this.readOnly = false;
    } else {
      this.readOnly = true;
    }

    this.signerOrProvider = signerOrProvider;
    this.chainId = chainId;

    if (mediaAddress && marketAddress) {
      const parsedMediaAddress = validateAndParseAddress(mediaAddress);
      const parsedMarketAddress = validateAndParseAddress(marketAddress);
      this.mediaAddress = parsedMediaAddress;
      this.marketAddress = parsedMarketAddress;
    } else {
      this.mediaAddress = addresses[chainId].media;
      this.marketAddress = addresses[chainId].market;
    }

    this.media = Media__factory.connect(this.mediaAddress, signerOrProvider);
    this.market = Market__factory.connect(this.marketAddress, signerOrProvider);
  }

  /*********************
   * openAR View Methods
   *********************
   */

  /**
   * Fetches the content hash for the specified media on the openAR Media Contract
   * @param mediaId
   */
  public async fetchContentHash(mediaId: BigNumberish): Promise<string> {
    return this.media.tokenContentHashes(mediaId);
  }

  /**
   * Fetches the metadata hash for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async fetchMetadataHash(mediaId: BigNumberish): Promise<string> {
    return this.media.tokenMetadataHashes(mediaId);
  }

  /**
   * Fetches the content uri for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async fetchContentURI(mediaId: BigNumberish): Promise<string> {
    return this.media.tokenURI(mediaId);
  }

  /**
   * Fetches the metadata uri for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async fetchMetadataURI(mediaId: BigNumberish): Promise<string> {
    return this.media.tokenMetadataURI(mediaId);
  }

  /**
   * Fetches the media data the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async fetchMediaData(mediaId: BigNumberish): Promise<MediaData> {
    return this.media.tokenMediaData(mediaId);
  }

  /**
   * Fetches the creator for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async fetchCreator(mediaId: BigNumberish): Promise<string> {
    return this.media.tokenCreators(mediaId);
  }

  /**
   * Fetches the current bid shares for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async fetchCurrentBidShares(
    mediaId: BigNumberish
  ): Promise<BidShares> {
    return this.market.bidSharesForToken(mediaId);
  }

  /**
   * Fetches the current ask for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async fetchCurrentAsk(mediaId: BigNumberish): Promise<Ask> {
    return this.market.currentAskForToken(mediaId);
  }

  /**
   * Fetches the current ask for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async fetchPlatformCuts(): Promise<PlatformCuts> {
    return this.market.platformCuts();
  }

  /**
   * Fetches the current bid for the specified bidder for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param bidder
   */
  public async fetchCurrentBidForBidder(
    mediaId: BigNumberish,
    bidder: string
  ): Promise<Bid> {
    return this.market.bidForTokenBidder(mediaId, bidder);
  }

  /**
   * Fetches the permit nonce on the specified media id for the owner address
   * @param address
   * @param mediaId
   */
  public async fetchPermitNonce(
    address: string,
    mediaId: BigNumberish
  ): Promise<BigNumber> {
    return this.media.permitNonces(address, mediaId);
  }

  /**
   * Fetches the current mintWithSig nonce for the specified address
   * @param address
   * @param mediaId
   */
  public async fetchMintWithSigNonce(address: string): Promise<BigNumber> {
    return this.media.mintWithSigNonces(address);
  }

  /*********************
   * openAR Write Methods
   *********************
   */

  /**
   * Updates the content uri for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param tokenURI
   */
  public async updateContentURI(
    mediaId: BigNumberish,
    tokenURI: string
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
      validateURI(tokenURI);
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    return this.media.updateTokenURI(mediaId, tokenURI);
  }

  /**
   * Updates the metadata uri for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param metadataURI
   */
  public async updateMetadataURI(
    mediaId: BigNumberish,
    metadataURI: string
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
      validateURI(metadataURI);
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    return this.media.updateTokenMetadataURI(mediaId, metadataURI);
  }

  /**
   * Mints a new piece of media on an instance of the openAR Media Contract
   * @param mintData
   * @param bidShares
   */
  public async mint(
    mintData: MintData,
    bidShares: BidShares
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
      validateURI(mintData.metadataURI);
      validateURI(mintData.tokenURI);
      validateBidShares(
        bidShares.platform,
        bidShares.pool,
        bidShares.creator,
        bidShares.owner,
        bidShares.prevOwner
      );
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    const gasEstimate = await this.media.estimateGas.mint(mintData, bidShares);
    const paddedEstimate = gasEstimate.mul(110).div(100);
    return this.media.mint(mintData, bidShares, {
      gasLimit: paddedEstimate.toString(),
    });
  }

  /**
   * Mints a new piece of media on an instance of the openAR Media Contract
   * @param creator
   * @param MintData
   * @param bidShares
   * @param sig
   */
  public async mintWithSig(
    creator: string,
    mintData: MintData,
    bidShares: BidShares,
    sig: EIP712Signature
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
      validateURI(mintData.metadataURI);
      validateURI(mintData.tokenURI);
      validateBidShares(
        bidShares.platform,
        bidShares.pool,
        bidShares.creator,
        bidShares.owner,
        bidShares.prevOwner
      );
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    return this.media.mintWithSig(creator, mintData, bidShares, sig);
  }

  /**
   * Sets an ask on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param ask
   */
  public async setAsk(
    mediaId: BigNumberish,
    ask: Ask,
    bidShares: BidShares
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    if (!validateBidOrAsk(Decimal.new(ask.amount.toString()), bidShares))
      return Promise.reject("invalid ask");

    return this.market.setAsk(mediaId, ask);
  }

  /**
   * Sets an ask on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param ask
   */
  public async setAskForBatch(
    mediaIds: BigNumberish[],
    ask: Ask,
    bidShares: BidShares,
    objKeyHex: BytesLike
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    if (!validateBidOrAsk(Decimal.new(ask.amount.toString()), bidShares))
      return Promise.reject("invalid ask");

    return this.market.setAskForBatch(mediaIds, ask, objKeyHex);
  }

  /**
   * Sets a bid on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param bid
   */
  public async setBid(
    mediaId: BigNumberish,
    bid: Bid,
    bidShares: BidShares
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    if (!validateBidOrAsk(Decimal.new(bid.amount.toString()), bidShares))
      return Promise.reject("invalid bid");

    return this.market.setBid(mediaId, bid);
  }

  /**
   * Removes the ask on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async removeAsk(mediaId: BigNumberish): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    return this.market.removeAsk(mediaId);
  }

  /**
   * Removes the ask on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async removeAskForBatch(
    mediaIds: BigNumberish[]
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    return this.market.removeAskForBatch(mediaIds);
  }

  /**
   * Removes the bid for the msg.sender on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async removeBid(mediaId: BigNumberish): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    return this.media.removeBid(mediaId);
  }

  /**
   * Accepts the specified bid on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param bid
   */
  public async acceptBid(
    mediaId: BigNumberish,
    bid: Bid
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    return this.market.acceptBid(mediaId, bid);
  }

  /**
   * Revokes the approval of an approved account for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async revokeApproval(
    mediaId: BigNumberish
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    return this.media.revokeApproval(mediaId);
  }

  /***********************
   * ERC-721 View Methods
   ***********************
   */

  /**
   * Fetches the total balance of media owned by the specified owner on an instance of the openAR Media Contract
   * @param owner
   */
  public async fetchBalanceOf(owner: string): Promise<BigNumber> {
    return this.media.balanceOf(owner);
  }

  /**
   * Fetches the owner of the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async fetchOwnerOf(mediaId: BigNumberish): Promise<string> {
    return this.media.ownerOf(mediaId);
  }

  /**
   * Fetches the mediaId of the specified owner by index on an instance of the openAR Media Contract
   * @param owner
   * @param index
   */
  public async fetchMediaOfOwnerByIndex(
    owner: string,
    index: BigNumberish
  ): Promise<BigNumber> {
    return this.media.tokenOfOwnerByIndex(owner, index);
  }

  /**
   * Fetches the total amount of non-burned media that has been minted on an instance of the openAR Media Contract
   */
  public async fetchTotalMedia(): Promise<BigNumber> {
    return this.media.totalSupply();
  }

  /**
   * Fetches the mediaId by index on an instance of the openAR Media Contract
   * @param index
   */
  public async fetchMediaByIndex(index: BigNumberish): Promise<BigNumber> {
    return this.media.tokenByIndex(index);
  }

  /**
   * Fetches the approved account for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */
  public async fetchApproved(mediaId: BigNumberish): Promise<string> {
    return this.media.getApproved(mediaId);
  }

  /**
   * Fetches if the specified operator is approved for all media owned by the specified owner on an instance of the openAR Media Contract
   * @param owner
   * @param operator
   */
  public async fetchIsApprovedForAll(
    owner: string,
    operator: string
  ): Promise<boolean> {
    return this.media.isApprovedForAll(owner, operator);
  }

  /***********************
   * ERC-721 Write Methods
   ***********************
   */

  /**
   * Transfers the specified media to the specified to address on an instance of the openAR Media Contract
   * @param from
   * @param to
   * @param mediaId
   */
  public async transferFrom(
    from: string,
    to: string,
    mediaId: BigNumberish
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    return this.media.transferFrom(from, to, mediaId);
  }

  /**
   * Executes a SafeTransfer of the specified media to the specified address if and only if it adheres to the ERC721-Receiver Interface
   * @param from
   * @param to
   * @param mediaId
   */
  public async safeTransferFrom(
    from: string,
    to: string,
    mediaId: BigNumberish
  ): Promise<ContractTransaction> {
    try {
      this.ensureNotReadOnly();
    } catch (err: any) {
      return Promise.reject(err.message);
    }

    return this.media.safeTransferFrom(from, to, mediaId);
  }

  /****************
   * Miscellaneous
   * **************
   */

  /**
   * Returns the EIP-712 Domain for an instance of the openAR Media Contract
   */
  public eip712Domain(): EIP712Domain {
    return generateEIP712Domain(
      mediaContractName,
      this.chainId,
      this.mediaAddress
    );
  }

  public createAsk(amount: number): Ask {
    return {
      amount: Decimal.new(amount).value,
      currency: AddressZero,
    };
  }

  /**
   * Returns the given seconds as BigNumber
   */
  public createDeadline(seconds: number): BigNumber {
    return BigNumber.from(Math.floor(new Date().getTime() / 1000) + seconds);
  }

  /**
   * Checks to see if a Bid's amount is evenly splittable given the media's current bidShares
   *
   * @param mediaId
   * @param bid
   */
  public async isValidBid(mediaId: BigNumberish, bid: Bid): Promise<boolean> {
    const isAmountValid = await this.market.isValidBid(mediaId, bid.amount);
    const decimal100 = Decimal.new(100);
    const currentBidShares = await this.fetchCurrentBidShares(mediaId);
    const isSellOnShareValid = bid.sellOnShare.value.lte(
      decimal100.value.sub(currentBidShares.creator.value)
    );

    return isAmountValid && isSellOnShareValid;
  }

  /**
   * Checks to see if an Ask's amount is evenly splittable given the media's current bidShares
   *
   * @param mediaId
   * @param ask
   */
  public isValidAsk(mediaId: BigNumberish, ask: Ask): Promise<boolean> {
    return this.market.isValidBid(mediaId, ask.amount);
  }

  /**
   * Checks to see if a piece of media has verified uris that hash to their immutable hashes
   *
   * @param mediaId
   * @param timeout
   */
  public async isVerifiedMedia(
    mediaId: BigNumberish,
    timeout: number = 10
  ): Promise<boolean> {
    try {
      const [tokenURI, metadataURI, contentHash, metadataHash] =
        await Promise.all([
          this.fetchContentURI(mediaId),
          this.fetchMetadataURI(mediaId),
          this.fetchContentHash(mediaId),
          this.fetchMetadataHash(mediaId),
        ]);

      const mintData = constructMintData(
        stringToBytes32(nanoidCustom16()),
        stringToBytes32(nanoidCustom16()),
        tokenURI,
        metadataURI,
        stringToBytes32(contentHash),
        stringToBytes32(metadataHash),
        BigNumber.from(1),
        BigNumber.from(1)
      );
      return await isMintDataVerified(mintData, timeout);
    } catch (err: any) {
      return Promise.reject(err.message);
    }
  }

  /******************
   * Private Methods
   ******************
   */

  /**
   * Throws an error if called on a readOnly == true instance of openAR Sdk
   * @private
   */
  private ensureNotReadOnly() {
    if (this.readOnly) {
      throw new Error(
        "ensureNotReadOnly: readOnly openAR instance cannot call contract methods that require a signer."
      );
    }
  }
}

export default OpenAR;

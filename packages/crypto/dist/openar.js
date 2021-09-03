import "core-js/modules/es.promise.js";
import "core-js/modules/es.regexp.to-string.js";
import "core-js/modules/es.array.iterator.js";
import "core-js/modules/web.dom-collections.iterator.js";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import { Decimal } from "./decimal.js";
import { Signer } from "@ethersproject/abstract-signer";
import { MarketFactory, MediaFactory } from "@openar/contracts";
import { addresses } from "./addresses.js";
import { chainIdToNetworkName, constructMediaData, isMediaDataVerified, validateAndParseAddress, validateBidShares, validateURI } from "./utils.js";
import invariant from "tiny-invariant";
export class OpenAR {
  constructor(signerOrProvider, chainId, mediaAddress, marketAddress) {
    _defineProperty(this, "chainId", void 0);

    _defineProperty(this, "mediaAddress", void 0);

    _defineProperty(this, "marketAddress", void 0);

    _defineProperty(this, "signerOrProvider", void 0);

    _defineProperty(this, "media", void 0);

    _defineProperty(this, "market", void 0);

    _defineProperty(this, "readOnly", void 0);

    if (!mediaAddress != !marketAddress) {
      invariant(false, "openAr Constructor: mediaAddress and marketAddress must both be non-null or both be null");
    }

    if (Signer.isSigner(signerOrProvider)) {
      this.readOnly = false;
    } else {
      this.readOnly = true;
    }

    this.signerOrProvider = signerOrProvider;
    this.chainId = chainId;

    if (mediaAddress && marketAddress) {
      var parsedMediaAddress = validateAndParseAddress(mediaAddress);
      var parsedMarketAddress = validateAndParseAddress(marketAddress);
      this.mediaAddress = parsedMediaAddress;
      this.marketAddress = parsedMarketAddress;
    } else {
      var network = chainIdToNetworkName(chainId);
      this.mediaAddress = addresses[network].media;
      this.marketAddress = addresses[network].market;
    }

    console.log("openAR: market", this.marketAddress);
    console.log("openAR: media", this.mediaAddress);
    this.media = MediaFactory.connect(this.mediaAddress, signerOrProvider);
    this.market = MarketFactory.connect(this.marketAddress, signerOrProvider);
  }
  /*********************
   * openAR View Methods
   *********************
   */

  /**
   * Fetches the content hash for the specified media on the openAR Media Contract
   * @param mediaId
   */


  fetchContentHash(mediaId) {
    var _this = this;

    return _asyncToGenerator(function* () {
      return _this.media.tokenContentHashes(mediaId);
    })();
  }
  /**
   * Fetches the metadata hash for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  fetchMetadataHash(mediaId) {
    var _this2 = this;

    return _asyncToGenerator(function* () {
      return _this2.media.tokenMetadataHashes(mediaId);
    })();
  }
  /**
   * Fetches the content uri for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  fetchContentURI(mediaId) {
    var _this3 = this;

    return _asyncToGenerator(function* () {
      return _this3.media.tokenURI(mediaId);
    })();
  }
  /**
   * Fetches the metadata uri for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  fetchMetadataURI(mediaId) {
    var _this4 = this;

    return _asyncToGenerator(function* () {
      return _this4.media.tokenMetadataURI(mediaId);
    })();
  }
  /**
   * Fetches the creator for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  fetchCreator(mediaId) {
    var _this5 = this;

    return _asyncToGenerator(function* () {
      return _this5.media.tokenCreators(mediaId);
    })();
  }
  /**
   * Fetches the current bid shares for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  fetchCurrentBidShares(mediaId) {
    var _this6 = this;

    return _asyncToGenerator(function* () {
      return _this6.market.bidSharesForToken(mediaId);
    })();
  }
  /**
   * Fetches the current ask for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  fetchCurrentAsk(mediaId) {
    var _this7 = this;

    return _asyncToGenerator(function* () {
      return _this7.market.currentAskForToken(mediaId);
    })();
  }
  /**
   * Fetches the current bid for the specified bidder for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param bidder
   */


  fetchCurrentBidForBidder(mediaId, bidder) {
    var _this8 = this;

    return _asyncToGenerator(function* () {
      return _this8.market.bidForTokenBidder(mediaId, bidder);
    })();
  }
  /**
   * Fetches the permit nonce on the specified media id for the owner address
   * @param address
   * @param mediaId
   */


  fetchPermitNonce(address, mediaId) {
    var _this9 = this;

    return _asyncToGenerator(function* () {
      return _this9.media.permitNonces(address, mediaId);
    })();
  }
  /**
   * Fetches the current mintWithSig nonce for the specified address
   * @param address
   * @param mediaId
   */


  fetchMintWithSigNonce(address) {
    var _this10 = this;

    return _asyncToGenerator(function* () {
      return _this10.media.mintWithSigNonces(address);
    })();
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


  updateContentURI(mediaId, tokenURI) {
    var _this11 = this;

    return _asyncToGenerator(function* () {
      try {
        _this11.ensureNotReadOnly();

        validateURI(tokenURI);
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this11.media.updateTokenURI(mediaId, tokenURI);
    })();
  }
  /**
   * Updates the metadata uri for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param metadataURI
   */


  updateMetadataURI(mediaId, metadataURI) {
    var _this12 = this;

    return _asyncToGenerator(function* () {
      try {
        _this12.ensureNotReadOnly();

        validateURI(metadataURI);
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this12.media.updateTokenMetadataURI(mediaId, metadataURI);
    })();
  }
  /**
   * Mints a new piece of media on an instance of the openAR Media Contract
   * @param mintData
   * @param bidShares
   */


  mint(mediaData, bidShares) {
    var _this13 = this;

    return _asyncToGenerator(function* () {
      try {
        _this13.ensureNotReadOnly();

        validateURI(mediaData.metadataURI);
        validateURI(mediaData.tokenURI);
        validateBidShares(bidShares.platform, bidShares.pool, bidShares.creator, bidShares.owner, bidShares.prevOwner);
      } catch (err) {
        return Promise.reject(err.message);
      }

      var gasEstimate = yield _this13.media.estimateGas.mint(mediaData, bidShares);
      var paddedEstimate = gasEstimate.mul(110).div(100);
      return _this13.media.mint(mediaData, bidShares, {
        gasLimit: paddedEstimate.toString()
      });
    })();
  }
  /**
   * Mints a new piece of media on an instance of the openAR Media Contract
   * @param creator
   * @param mediaData
   * @param bidShares
   * @param sig
   */


  mintWithSig(creator, mediaData, bidShares, sig) {
    var _this14 = this;

    return _asyncToGenerator(function* () {
      try {
        _this14.ensureNotReadOnly();

        validateURI(mediaData.metadataURI);
        validateURI(mediaData.tokenURI);
        validateBidShares(bidShares.platform, bidShares.pool, bidShares.creator, bidShares.owner, bidShares.prevOwner);
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this14.media.mintWithSig(creator, mediaData, bidShares, sig);
    })();
  }
  /**
   * Sets an ask on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param ask
   */


  setAsk(mediaId, ask) {
    var _this15 = this;

    return _asyncToGenerator(function* () {
      try {
        _this15.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this15.media.setAsk(mediaId, ask);
    })();
  }
  /**
   * Sets a bid on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param bid
   */


  setBid(mediaId, bid) {
    var _this16 = this;

    return _asyncToGenerator(function* () {
      try {
        _this16.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this16.media.setBid(mediaId, bid);
    })();
  }
  /**
   * Removes the ask on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  removeAsk(mediaId) {
    var _this17 = this;

    return _asyncToGenerator(function* () {
      try {
        _this17.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this17.media.removeAsk(mediaId);
    })();
  }
  /**
   * Removes the bid for the msg.sender on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  removeBid(mediaId) {
    var _this18 = this;

    return _asyncToGenerator(function* () {
      try {
        _this18.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this18.media.removeBid(mediaId);
    })();
  }
  /**
   * Accepts the specified bid on the specified media on an instance of the openAR Media Contract
   * @param mediaId
   * @param bid
   */


  acceptBid(mediaId, bid) {
    var _this19 = this;

    return _asyncToGenerator(function* () {
      try {
        _this19.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this19.media.acceptBid(mediaId, bid);
    })();
  }
  /**
   * Grants the spender approval for the specified media using meta transactions as outlined in EIP-712
   * @param sender
   * @param mediaId
   * @param sig
   */


  permit(spender, mediaId, sig) {
    var _this20 = this;

    return _asyncToGenerator(function* () {
      try {
        _this20.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this20.media.permit(spender, mediaId, sig);
    })();
  }
  /**
   * Revokes the approval of an approved account for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  revokeApproval(mediaId) {
    var _this21 = this;

    return _asyncToGenerator(function* () {
      try {
        _this21.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this21.media.revokeApproval(mediaId);
    })();
  }
  /**
   * Burns the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  burn(mediaId) {
    var _this22 = this;

    return _asyncToGenerator(function* () {
      try {
        _this22.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this22.media.burn(mediaId);
    })();
  }
  /***********************
   * ERC-721 View Methods
   ***********************
   */

  /**
   * Fetches the total balance of media owned by the specified owner on an instance of the openAR Media Contract
   * @param owner
   */


  fetchBalanceOf(owner) {
    var _this23 = this;

    return _asyncToGenerator(function* () {
      return _this23.media.balanceOf(owner);
    })();
  }
  /**
   * Fetches the owner of the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  fetchOwnerOf(mediaId) {
    var _this24 = this;

    return _asyncToGenerator(function* () {
      return _this24.media.ownerOf(mediaId);
    })();
  }
  /**
   * Fetches the mediaId of the specified owner by index on an instance of the openAR Media Contract
   * @param owner
   * @param index
   */


  fetchMediaOfOwnerByIndex(owner, index) {
    var _this25 = this;

    return _asyncToGenerator(function* () {
      return _this25.media.tokenOfOwnerByIndex(owner, index);
    })();
  }
  /**
   * Fetches the total amount of non-burned media that has been minted on an instance of the openAR Media Contract
   */


  fetchTotalMedia() {
    var _this26 = this;

    return _asyncToGenerator(function* () {
      return _this26.media.totalSupply();
    })();
  }
  /**
   * Fetches the mediaId by index on an instance of the openAR Media Contract
   * @param index
   */


  fetchMediaByIndex(index) {
    var _this27 = this;

    return _asyncToGenerator(function* () {
      return _this27.media.tokenByIndex(index);
    })();
  }
  /**
   * Fetches the approved account for the specified media on an instance of the openAR Media Contract
   * @param mediaId
   */


  fetchApproved(mediaId) {
    var _this28 = this;

    return _asyncToGenerator(function* () {
      return _this28.media.getApproved(mediaId);
    })();
  }
  /**
   * Fetches if the specified operator is approved for all media owned by the specified owner on an instance of the openAR Media Contract
   * @param owner
   * @param operator
   */


  fetchIsApprovedForAll(owner, operator) {
    var _this29 = this;

    return _asyncToGenerator(function* () {
      return _this29.media.isApprovedForAll(owner, operator);
    })();
  }
  /***********************
   * ERC-721 Write Methods
   ***********************
   */

  /**
   * Grants approval to the specified address for the specified media on an instance of the openAR Media Contract
   * @param to
   * @param mediaId
   */


  approve(to, mediaId) {
    var _this30 = this;

    return _asyncToGenerator(function* () {
      try {
        _this30.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this30.media.approve(to, mediaId);
    })();
  }
  /**
   * Grants approval for all media owner by msg.sender on an instance of the openAR Media Contract
   * @param operator
   * @param approved
   */


  setApprovalForAll(operator, approved) {
    var _this31 = this;

    return _asyncToGenerator(function* () {
      try {
        _this31.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this31.media.setApprovalForAll(operator, approved);
    })();
  }
  /**
   * Transfers the specified media to the specified to address on an instance of the openAR Media Contract
   * @param from
   * @param to
   * @param mediaId
   */


  transferFrom(from, to, mediaId) {
    var _this32 = this;

    return _asyncToGenerator(function* () {
      try {
        _this32.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this32.media.transferFrom(from, to, mediaId);
    })();
  }
  /**
   * Executes a SafeTransfer of the specified media to the specified address if and only if it adheres to the ERC721-Receiver Interface
   * @param from
   * @param to
   * @param mediaId
   */


  safeTransferFrom(from, to, mediaId) {
    var _this33 = this;

    return _asyncToGenerator(function* () {
      try {
        _this33.ensureNotReadOnly();
      } catch (err) {
        return Promise.reject(err.message);
      }

      return _this33.media.safeTransferFrom(from, to, mediaId);
    })();
  }
  /****************
   * Miscellaneous
   * **************
   */

  /**
   * Returns the EIP-712 Domain for an instance of the openAR Media Contract
   */


  eip712Domain() {
    // Due to a bug in ganache-core, set the chainId to 1 if its a local blockchain
    // https://github.com/trufflesuite/ganache-core/issues/515
    var chainId = this.chainId == 50 ? 1337 : this.chainId;
    return {
      name: "openAR",
      version: "1",
      chainId: chainId,
      verifyingContract: this.mediaAddress
    };
    uxed;
  }
  /**
   * Checks to see if a Bid's amount is evenly splittable given the media's current bidShares
   *
   * @param mediaId
   * @param bid
   */


  isValidBid(mediaId, bid) {
    var _this34 = this;

    return _asyncToGenerator(function* () {
      var isAmountValid = yield _this34.market.isValidBid(mediaId, bid.amount);
      var decimal100 = Decimal.new(100);
      var currentBidShares = yield _this34.fetchCurrentBidShares(mediaId);
      var isSellOnShareValid = bid.sellOnShare.value.lte(decimal100.value.sub(currentBidShares.creator.value));
      return isAmountValid && isSellOnShareValid;
    })();
  }
  /**
   * Checks to see if an Ask's amount is evenly splittable given the media's current bidShares
   *
   * @param mediaId
   * @param ask
   */


  isValidAsk(mediaId, ask) {
    return this.market.isValidBid(mediaId, ask.amount);
  }
  /**
   * Checks to see if a piece of media has verified uris that hash to their immutable hashes
   *
   * @param mediaId
   * @param timeout
   */


  isVerifiedMedia(mediaId) {
    var _arguments = arguments,
        _this35 = this;

    return _asyncToGenerator(function* () {
      var timeout = _arguments.length > 1 && _arguments[1] !== undefined ? _arguments[1] : 10;

      try {
        var [tokenURI, metadataURI, contentHash, metadataHash] = yield Promise.all([_this35.fetchContentURI(mediaId), _this35.fetchMetadataURI(mediaId), _this35.fetchContentHash(mediaId), _this35.fetchMetadataHash(mediaId)]);
        var mediaData = constructMediaData(tokenURI, metadataURI, contentHash, metadataHash);
        return yield isMediaDataVerified(mediaData, timeout);
      } catch (err) {
        return Promise.reject(err.message);
      }
    })();
  }
  /******************
   * Private Methods
   ******************
   */

  /**
   * Throws an error if called on a readOnly == true instance of openAR Sdk
   * @private
   */


  ensureNotReadOnly() {
    if (this.readOnly) {
      throw new Error("ensureNotReadOnly: readOnly openAR instance cannot call contract methods that require a signer.");
    }
  }

}
export default OpenAR;
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import "core-js/modules/es.regexp.to-string.js";
import "core-js/modules/es.number.to-fixed.js";
import "core-js/modules/es.promise.js";
import "core-js/modules/es.regexp.exec.js";
import "core-js/modules/es.string.match.js";
import sjcl from "sjcl";
import warning from "tiny-warning";
import invariant from "tiny-invariant";
import { getAddress } from "@ethersproject/address";
import { hexDataLength, hexlify, arrayify, isHexString } from "@ethersproject/bytes";
import axios from "axios";
import { recoverTypedSignature, signTypedData_v4 } from "eth-sig-util";
import { fromRpcSig, toRpcSig } from "ethereumjs-util";
import { Decimal } from "./decimal.js";
export function validateBytes32(value) {
  if (typeof value === "string") {
    if (isHexString(value) && hexDataLength(value) === 32) {
      return;
    }

    invariant(false, "".concat(value, " is not a 0x prefixed 32 bytes hex string"));
  } else {
    if (hexDataLength(hexlify(value)) === 32) {
      return;
    }

    invariant(false, "value is not a length 32 byte array");
  }
}
export function validateBidShares(platform, pool, creator, owner, prevOwner) {
  var decimal100 = Decimal.new(100);
  var sum = creator.value.add(platform.value).add(pool.value).add(owner.value).add(prevOwner.value);

  if (sum.toString() !== decimal100.value.toString()) {
    invariant(false, "The BidShares sum to ".concat(sum.toString(), ", but they must sum to ").concat(decimal100.value.toString()));
  }
}
export var openARConstructBidShares = (platform, pool, creator, owner, prevOwner) => {
  var decimalPlatform = Decimal.new(parseFloat(platform.toFixed(4)));
  var decimalPool = Decimal.new(parseFloat(pool.toFixed(4)));
  var decimalCreator = Decimal.new(parseFloat(creator.toFixed(4)));
  var decimalOwner = Decimal.new(parseFloat(owner.toFixed(4)));
  var decimalPrevOwner = Decimal.new(parseFloat(prevOwner.toFixed(4)));
  validateBidShares(decimalPlatform, decimalPool, decimalCreator, decimalOwner, decimalPrevOwner);
  return {
    platform: decimalPlatform,
    pool: decimalPool,
    creator: decimalCreator,
    owner: decimalOwner,
    prevOwner: decimalPrevOwner
  };
};
/**
 * Signs a openAR MintWithSig Payload by EIP-712
 *
 * @param owner
 * @param contentHash
 * @param metadataHash
 * @param creatorShareBN
 * @param nonce
 * @param deadline
 * @param domain
 */

export var generateSignMintWithSignMessageData = (contentHash, metadataHash, creatorShareBN, nonce, deadline, domain) => {
  var creatorShare = creatorShareBN.toString();
  return {
    types: {
      EIP712Domain: [{
        name: "name",
        type: "string"
      }, {
        name: "version",
        type: "string"
      }, {
        name: "chainId",
        type: "uint256"
      }, {
        name: "verifyingContract",
        type: "address"
      }],
      MintWithSig: [{
        name: "contentHash",
        type: "bytes32"
      }, {
        name: "metadataHash",
        type: "bytes32"
      }, {
        name: "creatorShare",
        type: "uint256"
      }, {
        name: "nonce",
        type: "uint256"
      }, {
        name: "deadline",
        type: "uint256"
      }]
    },
    primaryType: "MintWithSig",
    domain,
    message: {
      contentHash,
      metadataHash,
      creatorShare,
      nonce,
      deadline
    }
  };
};
export var recoverSignatureFromMintWithSig = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (contentHash, metadataHash, creatorShareBN, nonce, deadline, domain, eipSig) {
    var r = arrayify(eipSig.r);
    var s = arrayify(eipSig.s);
    var creatorShare = creatorShareBN.toString();
    var recovered = recoverTypedSignature({
      data: {
        types: {
          EIP712Domain: [{
            name: "name",
            type: "string"
          }, {
            name: "version",
            type: "string"
          }, {
            name: "chainId",
            type: "uint256"
          }, {
            name: "verifyingContract",
            type: "address"
          }],
          MintWithSig: [{
            name: "contentHash",
            type: "bytes32"
          }, {
            name: "metadataHash",
            type: "bytes32"
          }, {
            name: "creatorShare",
            type: "uint256"
          }, {
            name: "nonce",
            type: "uint256"
          }, {
            name: "deadline",
            type: "uint256"
          }]
        },
        primaryType: "MintWithSig",
        domain: domain,
        message: {
          contentHash,
          metadataHash,
          creatorShare,
          nonce,
          deadline
        }
      },
      sig: toRpcSig(eipSig.v, Buffer.from(r), Buffer.from(s))
    });
    return recovered;
  });

  return function recoverSignatureFromMintWithSig(_x, _x2, _x3, _x4, _x5, _x6, _x7) {
    return _ref.apply(this, arguments);
  };
}();
/*
 * Signs a openAR MintWithSig Payload by EIP-712
 *
 * @param owner
 * @param contentHash
 * @param metadataHash
 * @param creatorShareBN
 * @param nonce
 * @param deadline
 * @param domain
 */

export var generateMintArObjectSignMessageData = (keyHash, editionOf, setInitialAsk, initialAskBN, creatorShareBN, nonce, deadline, domain) => {
  var initialAsk = initialAskBN.toString();
  var creatorShare = creatorShareBN.toString();
  return {
    types: {
      EIP712Domain: [{
        name: "name",
        type: "string"
      }, {
        name: "version",
        type: "string"
      }, {
        name: "chainId",
        type: "uint256"
      }, {
        name: "verifyingContract",
        type: "address"
      }],
      MintArObject: [{
        name: "keyHash",
        type: "bytes32"
      }, {
        name: "editionOf",
        type: "uint256"
      }, {
        name: "setInitialAsk",
        type: "bool"
      }, {
        name: "initialAsk",
        type: "uint256"
      }, {
        name: "creatorShare",
        type: "uint256"
      }, {
        name: "nonce",
        type: "uint256"
      }, {
        name: "deadline",
        type: "uint256"
      }]
    },
    primaryType: "MintArObject",
    domain,
    message: {
      keyHash,
      editionOf,
      setInitialAsk,
      initialAsk,
      creatorShare,
      nonce,
      deadline
    }
  };
};
export var recoverSignatureFromMintArObject = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (keyHash, editionOf, setInitialAsk, initialAskBN, creatorShareBN, nonce, deadline, domain, eipSig) {
    var r = arrayify(eipSig.r);
    var s = arrayify(eipSig.s);
    var initialAsk = initialAskBN.toString();
    var creatorShare = creatorShareBN.toString();
    var recovered = recoverTypedSignature({
      data: {
        types: {
          EIP712Domain: [{
            name: "name",
            type: "string"
          }, {
            name: "version",
            type: "string"
          }, {
            name: "chainId",
            type: "uint256"
          }, {
            name: "verifyingContract",
            type: "address"
          }],
          MintArObject: [{
            name: "keyHash",
            type: "bytes32"
          }, {
            name: "editionOf",
            type: "uint256"
          }, {
            name: "setInitialAsk",
            type: "bool"
          }, {
            name: "initialAsk",
            type: "uint256"
          }, {
            name: "creatorShare",
            type: "uint256"
          }, {
            name: "nonce",
            type: "uint256"
          }, {
            name: "deadline",
            type: "uint256"
          }]
        },
        primaryType: "MintArObject",
        domain: domain,
        message: {
          keyHash,
          editionOf,
          setInitialAsk,
          initialAsk,
          creatorShare,
          nonce,
          deadline
        }
      },
      sig: toRpcSig(eipSig.v, Buffer.from(r), Buffer.from(s))
    });
    return recovered;
  });

  return function recoverSignatureFromMintArObject(_x8, _x9, _x10, _x11, _x12, _x13, _x14, _x15, _x16) {
    return _ref2.apply(this, arguments);
  };
}();
/**
 * Signs a openAR MintWithSig Message as specified by EIP-712
 *
 * @param owner
 * @param contentHash
 * @param metadataHash
 * @param creatorShareBN
 * @param nonce
 * @param deadline
 * @param domain
 */

export var signMintWithSigMessageFromWallet = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (owner, contentHash, metadataHash, creatorShareBN, nonce, deadline, domain) {
    try {
      validateBytes32(contentHash);
      validateBytes32(metadataHash);
    } catch (err) {
      return Promise.reject(err.message);
    }

    return new Promise((res, reject) => {
      try {
        var sig = signTypedData_v4(Buffer.from(owner.privateKey.slice(2), "hex"), {
          data: generateSignMintWithSignMessageData(contentHash, metadataHash, creatorShareBN, nonce, deadline, domain)
        });
        var response = fromRpcSig(sig);
        res({
          r: response.r,
          s: response.s,
          v: response.v,
          deadline: deadline.toString()
        });
      } catch (e) {
        console.error(e);
        reject(e);
      }
    });
  });

  return function signMintWithSigMessageFromWallet(_x17, _x18, _x19, _x20, _x21, _x22, _x23) {
    return _ref3.apply(this, arguments);
  };
}();
/**
 * Returns the proper network name for the specified chainId
 *
 * @param chainId
 */

export function chainIdToNetworkName(chainId) {
  switch (chainId) {
    case 80001:
      {
        return "polygonMumbai";
      }

    case 137:
      {
        return "polygon";
      }

    case 100:
      {
        return "xDai";
      }

    case 4:
      {
        return "rinkeby";
      }

    case 1:
      {
        return "mainnet";
      }
  }

  invariant(false, "chainId ".concat(chainId, " not officially supported by the Zora Protocol"));
}
/**
 * Validates the URI is prefixed with `https://`
 *
 * @param uri
 */

export function validateURI(uri) {
  if (!uri.match(/^https:\/\/(.*)/)) {
    invariant(false, "".concat(uri, " must begin with `https://`"));
  }
}
/**
 * Validates and returns the checksummed address
 *
 * @param address
 */

export function validateAndParseAddress(address) {
  try {
    var checksummedAddress = getAddress(address);
    warning(address === checksummedAddress, "".concat(address, " is not checksummed."));
    return checksummedAddress;
  } catch (error) {
    invariant(false, "".concat(address, " is not a valid address."));
  }
}
/**
 * Constructs a MediaData type.
 *
 * @param tokenURI
 * @param metadataURI
 * @param contentHash
 * @param metadataHash
 */

export function constructMediaData(tokenURI, metadataURI, contentHash, metadataHash) {
  // validate the hash to ensure it fits in bytes32
  validateBytes32(contentHash);
  validateBytes32(metadataHash);
  validateURI(tokenURI);
  validateURI(metadataURI);
  return {
    tokenURI: tokenURI,
    metadataURI: metadataURI,
    contentHash: contentHash,
    metadataHash: metadataHash
  };
}
/********************
 * Hashing Utilities
 ********************
 */

/**
 * Generates the sha256 hash from a buffer and returns the hash hex-encoded
 *
 * @param buffer
 */

export function sha256FromBuffer(buffer) {
  var bitArray = sjcl.codec.hex.toBits(buffer.toString("hex"));
  var hashArray = sjcl.hash.sha256.hash(bitArray);
  return "0x".concat(sjcl.codec.hex.fromBits(hashArray));
}
/**
 * Returns the `verified` status of a uri.
 * A uri is only considered `verified` if its content hashes to its expected hash
 *
 * @param uri
 * @param expectedHash
 * @param timeout
 */

export function isURIHashVerified(_x24, _x25) {
  return _isURIHashVerified.apply(this, arguments);
}
/**
 * Returns the `verified` status of some MediaData.
 * MediaData is only considered `verified` if the content of its URIs hash to their respective hash
 *
 * @param mediaData
 * @param timeout
 */

function _isURIHashVerified() {
  _isURIHashVerified = _asyncToGenerator(function* (uri, expectedHash) {
    var timeout = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 10;

    try {
      validateURI(uri);
      var resp = yield axios.get(uri, {
        timeout: timeout,
        responseType: "arraybuffer"
      });
      var uriHash = sha256FromBuffer(resp.data);
      var normalizedExpectedHash = hexlify(expectedHash);
      return uriHash == normalizedExpectedHash;
    } catch (err) {
      return Promise.reject(err.message);
    }
  });
  return _isURIHashVerified.apply(this, arguments);
}

export function isMediaDataVerified(_x26) {
  return _isMediaDataVerified.apply(this, arguments);
}

function _isMediaDataVerified() {
  _isMediaDataVerified = _asyncToGenerator(function* (mediaData) {
    var timeout = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;
    var isTokenURIVerified = yield isURIHashVerified(mediaData.tokenURI, mediaData.contentHash, timeout);
    var isMetadataURIVerified = yield isURIHashVerified(mediaData.metadataURI, mediaData.metadataHash, timeout);
    return isTokenURIVerified && isMetadataURIVerified;
  });
  return _isMediaDataVerified.apply(this, arguments);
}
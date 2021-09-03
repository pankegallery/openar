import "core-js/modules/es.regexp.to-string.js";
import "core-js/modules/es.promise.js";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

import { create, globSource } from "ipfs-http-client"; // "/ip4/0.0.0.0/tcp/5001"

export var ipfsCreateClient = url => {
  return create({
    url
  });
};
export var ipfsUploadFolder = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (ipfs, folderPath) {
    try {
      var _folderInfo$cid$toStr;

      console.log(1);
      var folderInfo = yield ipfs.add( // @ts-ignore
      globSource(folderPath, {
        recursive: true
      }));
      console.log(2);
      console.log("uF: ", folderInfo === null || folderInfo === void 0 ? void 0 : folderInfo.cid.toString());
      return (_folderInfo$cid$toStr = folderInfo === null || folderInfo === void 0 ? void 0 : folderInfo.cid.toString()) !== null && _folderInfo$cid$toStr !== void 0 ? _folderInfo$cid$toStr : null;
    } catch (err) {
      console.log(err);
    }

    return null;
  });

  return function ipfsUploadFolder(_x, _x2) {
    return _ref.apply(this, arguments);
  };
}();
export var ipfsUploadFile = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (ipfs, filePath) {
    try {
      var _folderInfo$cid$toStr2;

      console.log(1);
      var folderInfo = yield ipfs.add(filePath);
      console.log(2);
      console.log("uF: ", folderInfo === null || folderInfo === void 0 ? void 0 : folderInfo.cid.toString());
      return (_folderInfo$cid$toStr2 = folderInfo === null || folderInfo === void 0 ? void 0 : folderInfo.cid.toString()) !== null && _folderInfo$cid$toStr2 !== void 0 ? _folderInfo$cid$toStr2 : null;
    } catch (err) {
      console.log(err);
    }

    return null;
  });

  return function ipfsUploadFile(_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}();
export var ipfsUploadBuffer = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator(function* (ipfs, buffer) {
    try {
      var _fileInfo$cid$toStrin;

      var fileInfo = yield ipfs.add(buffer);
      console.log("uB: ", fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.cid.toString());
      return (_fileInfo$cid$toStrin = fileInfo === null || fileInfo === void 0 ? void 0 : fileInfo.cid.toString()) !== null && _fileInfo$cid$toStrin !== void 0 ? _fileInfo$cid$toStrin : null;
    } catch (err) {
      console.log(err);
    }

    return null;
  });

  return function ipfsUploadBuffer(_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();
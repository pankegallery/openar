/* eslint-disable security/detect-non-literal-fs-filename */
import { Bytes, providers, utils, Wallet, BigNumber } from "ethers";
import { AddressZero } from "@ethersproject/constants";

import fs from "fs";
import os from "os";
import dotenv from "dotenv";
import path from "path";

import Mustache from "mustache";
import { Media__factory, Media } from "@openar/contracts";

// !!!! ALWAY REMEMBER TO CLOSE YOU DB CONNECTION !!!
import Prisma from "@prisma/client";

import minimist from "minimist";

import {
  ipfsCreateClient,
  OpenArNFTMetaData,
  recoverSignatureFromMintArObject,
  validateAndParseAddress,
  addresses,
  stringToHexHash,
  Decimal,
  generateEIP712Domain,
  numberToBigNumber,
  stringToBytes,
  ipfsUploadFolder,
  ipfsUploadFile,
  mintArObjectBatchWithSig,
  stringToHexBytes,
  platformCuts,
  createEIP712Signature,
} from "@openar/crypto";

import { getApiConfig } from "../config";
import logger from "../services/serviceLogging";
import {
  ArObjectStatusEnum,
  ArtworkStatusEnum,
  sha256FromFile,
  sha256FromString,
  htmlToString,
} from "../utils";
import { min } from "date-fns";

dotenv.config();

const apiConfig = getApiConfig();

// connect to a different API
const ipfs = ipfsCreateClient(apiConfig.ipfsApiUrl);

const writeTemplateFile = async (
  templatePath: string,
  outputPath: string,
  vars: any
) => {
  const template = fs.readFileSync(templatePath, "utf8");
  fs.writeFileSync(outputPath, Mustache.render(template, vars));
};

const writeToIPFS = async (
  editionNumber: number,
  arObject: Prisma.ArObject & {
    heroImage: Prisma.Image | null;
    arModels: Prisma.ArModel[];
    artwork: Prisma.Artwork | null;
    creator: Prisma.User | null;
  }
): Promise<
  [
    tokenURI: string,
    metadataURI: string,
    contentHashBytes: Bytes,
    metadataHashBytes: Bytes
  ]
> => {
  const appPrefix = "openAR";
  let tmpDir,
    tokenURI = "",
    metaDataURI = "",
    contentHashBytes = stringToBytes(sha256FromString("")),
    metadataHashBytes = stringToBytes(sha256FromString(""));

  try {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));

    const ipfsFolderPath = path.join(tmpDir, arObject.key);
    const templateFolder = path.join(apiConfig.packageBaseDir, "ipfsarobject");
    // create new directory
    fs.mkdirSync(ipfsFolderPath);

    const glb = arObject?.arModels?.find((m) => m.type === "glb");
    const usdz = arObject?.arModels?.find((m) => m.type === "usdz");

    const glbMeta = ((glb as any)?.meta as any) ?? {};
    const usdzMeta = ((usdz as any)?.meta as any) ?? {};
    const imgMeta = arObject.heroImage?.meta as any;

    const description = `${htmlToString(
      arObject?.artwork?.description ?? ""
    )} ${htmlToString(arObject.description ?? "")}`.trim();

    const metaData: OpenArNFTMetaData = {
      image: "",
      animation_url: "",
      external_url: `${apiConfig.baseUrl.dapp}/a/${arObject?.artwork?.key}/${arObject.key}/`,
      original_creator: `${arObject?.creator?.ethAddress ?? ""}`.toLowerCase(),
      edition_number: editionNumber,
      edition_of: arObject?.editionOf ?? 1,
      name: arObject.title ?? "",
      description,
      artworkKey: arObject.key,
      arObjectKey: arObject?.artwork?.key ?? "",
      year: new Date(arObject.updatedAt).getFullYear(),
      mimeType: glbMeta?.mimeType,
    };

    const templateVars = {
      baseUrl: apiConfig.baseUrl.dapp,
      artworkKey: metaData.artworkKey,
      objKey: metaData.arObjectKey,
      title: metaData.name,
      description: arObject.description,
      editionOf: metaData.edition_of,
      editionNumber: metaData.edition_number,
      artworkTitle: arObject.artwork?.title,
      artworkDescription: arObject.artwork?.description,
      glb: path.parse(glbMeta?.originalFilePath).base,
      usdz: path.parse(usdzMeta?.originalFilePath).base,
      poster: path.parse(imgMeta?.originalFilePath).base,
      creator:
        arObject?.creator?.pseudonym ?? arObject?.creator?.ethAddress ?? "",
      bio: arObject?.creator?.bio,
      ethAddress: `${arObject?.creator?.ethAddress ?? ""}`.toLowerCase(),
      creatorURL: arObject?.creator?.url,
      year: metaData.year,
    };

    fs.copyFileSync(
      glbMeta?.originalFilePath,
      path.join(ipfsFolderPath, path.parse(glbMeta?.originalFilePath).base)
    );
    fs.copyFileSync(
      usdzMeta?.originalFilePath,
      path.join(ipfsFolderPath, path.parse(usdzMeta?.originalFilePath).base)
    );
    fs.copyFileSync(
      imgMeta?.originalFilePath,
      path.join(ipfsFolderPath, path.parse(imgMeta?.originalFilePath).base)
    );

    fs.copyFileSync(
      path.join(templateFolder, "model-viewer.min.js"),
      path.join(ipfsFolderPath, "model-viewer.min.js")
    );

    writeTemplateFile(
      path.join(templateFolder, "index.html"),
      path.join(ipfsFolderPath, "index.html"),
      templateVars
    );

    writeTemplateFile(
      path.join(templateFolder, "info.html"),
      path.join(ipfsFolderPath, "info.html"),
      templateVars
    );

    const cid = await ipfsUploadFolder(ipfs, ipfsFolderPath);

    metaData.image = `ipfs://${cid}/${
      path.parse(imgMeta?.originalFilePath).base
    }`;

    metaData.animation_url = `ipfs://${cid}/${
      path.parse(glbMeta?.originalFilePath).base
    }`;

    fs.writeFileSync(
      path.join(ipfsFolderPath, "metadata.json"),
      JSON.stringify(metaData)
    );

    metadataHashBytes = stringToBytes(
      sha256FromString(JSON.stringify(metaData))
    );

    contentHashBytes = stringToBytes(
      sha256FromString(
        `${await sha256FromFile(
          path.join(ipfsFolderPath, path.parse(glbMeta?.originalFilePath).base)
        )}${sha256FromString(`${editionNumber}/${arObject.editionOf}`)}`
      )
    );

    const cidMetaData = await ipfsUploadFile(
      ipfs,
      path.join(ipfsFolderPath, "metadata.json")
    );

    tokenURI = `https://ipfs.io/ipfs/${cid}/${
      path.parse(glbMeta?.originalFilePath).base
    }`;

    metaDataURI = `https://ipfs.io/ipfs/${cidMetaData}/metadata.json`;

    // the rest of your app goes here
  } catch (err) {
    logger.error(err);
  } finally {
    try {
      // TODO ENable
      if (tmpDir) {
        fs.rmSync(tmpDir, { recursive: true });
      }
    } catch (e) {
      logger.error(
        `An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`
      );
    }
  }
  return [tokenURI, metaDataURI, contentHashBytes, metadataHashBytes];
};

const processArObject = async (
  mediaContract: Media,
  contractWallet: Wallet,
  creatorAddress: string,
  arObject: Prisma.ArObject & {
    heroImage: Prisma.Image | null;
    arModels: Prisma.ArModel[];
    artwork: Prisma.Artwork | null;
    creator: Prisma.User | null;
  },
  mintMetaData: any,
  prisma: Prisma.PrismaClient,
  chainId: number
) => {
  let newStatus = ArObjectStatusEnum.MINTING;

  const [tokenURI, metaDataURI, contentHashBytes, metadataHashBytes] =
    await writeToIPFS(1, arObject);

  if (tokenURI === "" || metaDataURI === "") throw Error("IPFS Upload Error");

  const creatorCut = Decimal.new(100)
    .value.sub(platformCuts.firstSalePlatform.value)
    .sub(platformCuts.firstSalePool.value);

  // let offset = 0;

  // await new Promise(async (resolve, reject) => {
  //   while (offset < editionOfBN.toNumber()) {
  //     let nextBatchSize = batchSize;
  //     if (offset + batchSize > editionOfBN.toNumber())
  //       nextBatchSize = editionOfBN.toNumber() % batchSize;

  //     const data: MintArObjectData = {
  //       awKeyHex,
  //       objKeyHex,
  //       editionOf: editionOfBN,
  //       initialAsk: initialAsk.value,
  //       batchSize: BigNumber.from(nextBatchSize),
  //       batchOffset: BigNumber.from(offset),
  //       mintArObjectNonce: nonceBN,
  //       currency: currencyAddr,
  //       setInitialAsk,
  //     };

  //     await media
  //       .mintArObject(
  //         creator,
  //         tokenURIs.slice(offset, offset + nextBatchSize),
  //         metadataURIs.slice(offset, offset + nextBatchSize),
  //         contentHashes.slice(offset, offset + nextBatchSize),
  //         metadataHashes.slice(offset, offset + nextBatchSize),
  //         data,
  //         shares,
  //         sig
  //       )
  //       .catch((err: any) => reject(err));

  //     offset += batchSize;
  //   }

  //   resolve(true);
  // });

  // txReceipt = await provider.getTransactionReceipt(tx.hash);
  // console.log('Gas usage: ', txReceipt.gasUsed.toNumber());
  try {
    const tx = await mintArObjectBatchWithSig(
      1,
      0,
      mediaContract,
      creatorAddress,
      [tokenURI],
      [metaDataURI],
      [contentHashBytes],
      [metadataHashBytes],
      stringToHexBytes(arObject?.artwork?.key ?? ""),
      stringToHexBytes(arObject?.key ?? ""),
      numberToBigNumber(arObject.editionOf ?? 1),
      arObject.setInitialAsk,
      Decimal.new(arObject.askPrice ?? 0),
      numberToBigNumber((arObject?.mintSignature as any)?.nonce),
      AddressZero,
      {
        prevOwner: Decimal.new(0),
        owner: Decimal.new(0),
        creator: Decimal.rawBigNumber(creatorCut),
        platform: platformCuts.firstSalePlatform,
        pool: platformCuts.firstSalePool,
      },
      createEIP712Signature(
        (arObject?.mintSignature as any)?.signature,
        numberToBigNumber((arObject?.mintSignature as any)?.deadline)
      )
    );
    mintMetaData.txHashes = [...mintMetaData.txHashes, tx.hash];

    const txReceipt = await tx.wait(chainId === 31337 ? 0 : 4);

    if (txReceipt) {
      mintMetaData.blockNumbers = [
        ...mintMetaData.blockNumbers,
        txReceipt.blockNumber,
      ];

      const events = await mediaContract.queryFilter(
        mediaContract.filters.TokenObjectMinted(null, null),
        txReceipt.blockNumber
      );

      if (events && events.length > 0) {
        events.forEach((event: any) => {
          const logDescription = mediaContract.interface.parseLog(event);
          if (
            logDescription?.args?.tokenIds &&
            logDescription?.args?.data?.objKeyHex
          ) {
            const objKey = utils.parseBytes32String(
              logDescription?.args?.data?.objKeyHex ?? ""
            );

            if (objKey === arObject.key) {
              mintMetaData.tokenIds = [
                ...mintMetaData.tokenIds,
                ...logDescription?.args?.tokenIds.map((tID: BigNumber) =>
                  tID.toString()
                ),
              ];

              if (mintMetaData.tokenIds.length === arObject.editionOf) {
                newStatus = ArObjectStatusEnum.MINTED;
              }
            }
          }
        });
      }
    }

    //console.log(logDescription.args);
  } catch (err: any) {
    logger.error(err);
    newStatus = ArObjectStatusEnum.MINTERROR;
    mintMetaData.error = err.message;
    mintMetaData.stopped = new Date().toISOString();
    console.error(err);
  } finally {
    await prisma.arObject.update({
      data: {
        status: newStatus,
        mintMetaData,
      },
      where: {
        id: arObject.id,
      },
    });
  }
};

const doChores = async () => {
  const args = minimist(process.argv.slice(2), {
    //string: ['tokenURI', 'metadataURI', 'contentHash', 'metadataHash'],
  });

  if (!args.objectId) throw new Error("--objectId object ID is required");

  if (!args.chainId) throw new Error("--chainId chain ID is required");

  const { PrismaClient } = Prisma;
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `${apiConfig.db.url}&connection_limit=1`,
      },
    },
  });

  try {
    const arObject = await prisma.arObject.findUnique({
      where: {
        id: args.objectId,
      },
      include: {
        heroImage: true,
        arModels: true,
        artwork: true,
        creator: true,
      },
    });

    if (arObject) {
      if (
        ![ArObjectStatusEnum.MINT, ArObjectStatusEnum.MINTRETRY].includes(
          arObject.status ?? -1
        )
      )
        throw Error("Status of object excludes it from processing");

      if (
        ![
          ArtworkStatusEnum.PUBLISHED,
          ArtworkStatusEnum.HASMINTEDOBJECTS,
        ].includes(arObject?.artwork?.status ?? -1)
      )
        throw Error("Status of artwork excludes object from processing");

      if (!arObject?.heroImage?.id) throw Error("No hero image present");

      if (
        !arObject?.arModels ||
        !arObject?.arModels?.find((m) => m.type === "glb")
      )
        throw Error("No GLB present");

      if (
        !arObject?.arModels ||
        !arObject?.arModels?.find((m) => m.type === "usdz")
      )
        throw Error("No USDZ present");

      const creatorEthAddress = validateAndParseAddress(
        arObject?.creator?.ethAddress ?? ""
      );

      const mediaAddress = validateAndParseAddress(
        addresses[args.chainId]?.media ?? ""
      );

      const signature = (arObject?.mintSignature as any)?.signature;

      if (!signature) throw Error("No Signature present");

      const provider = new providers.JsonRpcProvider(process.env.RPC_ENDPOINT);

      const contractWallet = new Wallet(
        `0x${process.env.PRIVATE_KEY_DEPLOYER?.replace("0x", "")}`,
        provider
      );

      const mediaContract = Media__factory.connect(
        mediaAddress,
        contractWallet
      );

      const name = await mediaContract.name();

      const recoveredEthAddress = await recoverSignatureFromMintArObject(
        stringToHexHash(arObject?.artwork?.key ?? ""),
        stringToHexHash(arObject?.key ?? ""),
        numberToBigNumber(arObject.editionOf ?? 1),
        arObject.setInitialAsk,
        Decimal.new(arObject.askPrice ?? 0),
        numberToBigNumber((arObject?.mintSignature as any)?.nonce),
        numberToBigNumber((arObject?.mintSignature as any)?.deadline),
        generateEIP712Domain(name, args.chainId, mediaContract.address),
        signature
      );

      if (creatorEthAddress.toLowerCase() !== recoveredEthAddress.toLowerCase())
        throw Error("Signature verification failed");

      const mintMetaData = {
        tokenIds: [],
        blockNumbers: [],
        txHashes: [],
        started: new Date().toISOString(),
      };

      await prisma.arObject.update({
        data: {
          status: ArObjectStatusEnum.MINTING,
          mintMetaData,
        },
        where: {
          id: arObject.id,
        },
      });

      await processArObject(
        mediaContract,
        contractWallet,
        creatorEthAddress,
        arObject,
        mintMetaData,
        prisma,
        args.chainId
      );
    } else {
      throw Error("Not found");
    }
    await prisma.$disconnect();
  } catch (Err) {
    if (prisma) await prisma.$disconnect();
    logger.error(Err);
    throw Err;
  }
};

doChores()
  .then(async () => {
    process.exit(0);
  })
  .catch(async (Err) => {
    // eslint-disable-next-line no-console
    console.error(Err);
    logger.error(Err);
    process.exit(1);
  });

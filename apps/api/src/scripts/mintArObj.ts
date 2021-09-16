/* eslint-disable security/detect-non-literal-fs-filename */
import fs from "fs";
import os from "os";
import path from "path";

import Mustache from "mustache";
import { Market__factory } from "@openar/contracts";

import Prisma, { ArObject } from "@prisma/client";
import minimist from "minimist";

import { ipfsCreateClient, sha256FromFile } from "@openar/crypto";

import { prismaDisconnect } from "../db";
import { getApiConfig } from "../config";
import logger from "../services/serviceLogging";
import { ArObjectStatusEnum } from "../utils";


const apiConfig = getApiConfig();

// connect to a different API
const ipfs = ipfsCreateClient(apiConfig.ipfsApiUrl);

const uploadFolderToIPFS = async (
  folderPath: string
): Promise<string | null> => {
  try {
    const folderInfo = await ipfs.add(
      // @ts-ignore
      globSource(folderPath, { recursive: true })
    );
    return folderInfo?.cid.toString() ?? null;
  } catch (err) {
    console.log(err);
  }
  return null;
};

const uploadBufferToIPFS = async (buffer: Buffer): Promise<string | null> => {
  try {
    const fileInfo = await ipfs.add(buffer);
    return fileInfo?.cid.toString() ?? null;
  } catch (err) {
    console.log(err);
  }
  return null;
};

const writeTemplateFile = async (
  templatePath: string,
  outputPath: string,
  vars: any
) => {
  const template = fs.readFileSync(templatePath, "utf8");
  fs.writeFileSync(outputPath, Mustache.render(template, vars));
};

const processArObject = async (
  arObject: Prisma.ArObject & {
    heroImage: Prisma.Image | null;
    arModels: Prisma.ArModel[];
    artwork: Prisma.Artwork | null;
    creator: Prisma.User | null;
  }
) => {
  let tmpDir;
  const appPrefix = "openar";
  try {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), appPrefix));
    console.log(`TMP: ${tmpDir}`);

    const ipfsFolderPath = path.join(tmpDir, arObject.key);
    const templateFolder = path.join(apiConfig.packageBaseDir, "ipfsarobject");
    // create new directory
    fs.mkdirSync(ipfsFolderPath);

    console.log(`ipfsFolder: ${ipfsFolderPath}`);
    console.log(`templateFolder: ${templateFolder}`);

    const glb = arObject?.arModels?.find((m) => m.type === "glb");
    const usdz = arObject?.arModels?.find((m) => m.type === "usdz");

    const glbMeta = ((glb as any)?.meta as any) ?? {};
    const usdzMeta = ((usdz as any)?.meta as any) ?? {};
    const imgMeta = arObject.heroImage?.meta as any;

    const editionNumber = 1;

    const templateVars = {
      artworkKey: arObject.artwork?.key,
      objKey: arObject.key,
      title: arObject.title,
      description: arObject.description,
      editionOf: arObject.editionOf,
      editionNumber: editionNumber,
      artworkTitle: arObject.artwork?.title,
      artworkDescription: arObject.artwork?.description,
      glb: path.parse(glbMeta?.originalFilePath).base,
      usdz: path.parse(usdzMeta?.originalFilePath).base,
      poster: path.parse(imgMeta?.originalFilePath).base,
      creator:
        arObject?.creator?.pseudonym ?? arObject?.creator?.ethAddress ?? "",
      bio: arObject?.creator?.bio,
      ethAddress: arObject?.creator?.ethAddress,
      creatorURL: arObject?.creator?.url,
      year: new Date(arObject.updatedAt).getFullYear(),
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

    // writeTemplateFile

    // the rest of your app goes here
  } catch {
    // handle error
  } finally {
    try {
      // TODO: enable again ...
      // if (tmpDir) {
      //   fs.rmSync(tmpDir, { recursive: true });
      // }
    } catch (e) {
      console.error(
        `An error has occurred while removing the temp folder at ${tmpDir}. Please remove it manually. Error: ${e}`
      );
    }
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
    // TODO: how to ensuere how many connections are allowe??? Should only be one for this one...
    datasources: {
      db: {
        url: apiConfig.db.url,
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
          arObject.status
        )
      )
        throw Error("Status of object excludes it from processing");

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

      console.log(arObject);
      await processArObject(arObject);
    }
  } catch (Err) {
    logger.error(Err);
    throw Err;
  }
};

doChores()
  .then(async () => {
    await prismaDisconnect();
    process.exit(0);
  })
  .catch(async (Err) => {
    // eslint-disable-next-line no-console
    console.error(Err);
    logger.error(Err);
    await prismaDisconnect();
    process.exit(1);
  });

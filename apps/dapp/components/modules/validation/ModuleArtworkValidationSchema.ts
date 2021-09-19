import { string, object, number, boolean, mixed } from "yup";
import { validateBidOrAsk, Decimal } from "@openar/crypto";
import { appConfig } from "~/config";
import { ArObjectStatusEnum } from "~/utils";

export const ModuleArtworkCreateSchema = object().shape({
  title: string().required(),
  description: string().nonEmptyHtml({ max: 500 }).required(),
  url: string().url().nullable(),
  video: string().url().nullable(),
});

export const ModuleArtworkUpdateSchema = ModuleArtworkCreateSchema.concat(
  object().shape({
    status: number().required().typeError("Please select the publish state"),
  })
);

export const ModuleArObjectCreateSchema = object().shape({
  title: string().required(),
  description: string().html({ max: 500 }),
  public: boolean(),
});

export const ModuleArObjectUpdateSchema = ModuleArObjectCreateSchema.concat(
  object().shape({
    status: number().required(),
    heroImage: mixed().when("status", {
      is: ArObjectStatusEnum.PUBLISHED,
      then: number()
        .required()
        .nullable()
        .typeError("Please upload an image"),
      otherwise: mixed().nullable()
    }),
    modelGlb: mixed().when("status", {
      is: ArObjectStatusEnum.PUBLISHED,
      then: number()
        .required()
        .nullable()
        .typeError("Please upload your .gbl or .gltf model"),
      otherwise: mixed().nullable()
    }),
    modelUsdz: mixed().when("status", {
      is: ArObjectStatusEnum.PUBLISHED,
      then: number()
        .required()
        .nullable()
        .typeError("Please upload your .gbl or .gltf model"),
      otherwise: mixed().nullable()
    }),
  })
);

export const ModuleArObjectMintableSchema = object().shape({
  mintSignature: string().nullable(),
  setInitialAsk: boolean(),
  askPrice: number().when("setInitialAsk", {
    is: true,
    then: number()
      .transform((v, o) =>  (o === "" ? null : v))
      .typeError("should be a number > 0")
      .test({
        name: "isValidBidOrAsk",
        message: "This is not a valid ask",
        test: (value) => {
          if (Number.isNaN(value) || value <= 0)
            return false;

          const owner = Decimal.new(100);
          
          owner.value = owner.value
          .sub(appConfig.platformCuts.firstSalePlatform.value)
          .sub(appConfig.platformCuts.firstSalePool.value);
          
          return validateBidOrAsk(Decimal.new(value), {
            platform: appConfig.platformCuts.firstSalePlatform,
            pool: appConfig.platformCuts.firstSalePool,
            creator: Decimal.new(0),
            owner,
            prevOwner: Decimal.new(0),
          });
        },
      })
      .required(),
    otherwise: number().nullable(),
  }),
  editionOf: number()
    .transform((v, o) => (o === "" ? null : v))
    .typeError("should be a number > 0")
    .min(1)
    .max(100)
    .required(),
});

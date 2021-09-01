import { string, object, number, mixed, boolean } from "yup";

export const ModuleArtworkCreateSchema = object().shape({
  title: string().required(),
  description: string().nonEmptyHtml({ max: 500 }).required(),
  url: string().url().nullable(),
  video: string().url().nullable(),
});

export const ModuleArtworkUpdateSchema = ModuleArtworkCreateSchema.concat(
  object().shape({
    key: string().required().length(16),
    status: number().required().typeError("Please select the publish state"),
  })
);

export const ModuleArObjectCreateSchema = object().shape({
  mintObject: boolean(),
  title: string().required(),

  description: string().html({ max: 500 }),
  orderNumber: number()
    .transform((v, o) => (o === "" ? null : v))
    .nullable()
    .typeError("should be a number > 0"),
    // TODO: ensure that this is a number that works with the contract
  askPrice: number().when("mintObject", {
    is: true, // alternatively: (isBig, isSpecial) => isBig && isSpecial
    then: number()
      .transform((v, o) => (o === "" ? null : v))
      .nullable()
      .typeError("should be a number > 0")
      .required(),
    otherwise: number()
      .transform((v, o) => (o === "" ? null : v))
      .nullable()
      .typeError("should be a number > 0"),
  }),
  editionOf: number().when("mintObject", {
    is: true, // alternatively: (isBig, isSpecial) => isBig && isSpecial
    then: number()
      .transform((v, o) => (o === "" ? null : v))
      .nullable()
      .typeError("should be a number > 0")
      .min(1)
      .max(100)
      .required(),
    otherwise: number()
      .transform((v, o) => (o === "" ? null : v))
      .nullable()
      .typeError("should be a number > 0")
      .min(1)
      .max(100),
  }),
});

export const ModuleArObjectUpdateSchema = ModuleArObjectCreateSchema.concat(
  object().shape({
    mintSignature: string(),
    key: string().required().length(16),
    status: number().required().typeError("Please select the publish state"),
    heroImage: number()
      .required()
      .nullable()
      .typeError("Please upload an image"),
    modelGlb: number()
      .required()
      .nullable()
      .typeError("Please upload your .gbl or .gltf model"),
    modelUsdz: number()
      .required()
      .nullable()
      .typeError("Please upload your .usdz file"),
  })
);

import { string, object, number, boolean } from "yup";

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

  // TODO: remove order number 

  orderNumber: number()
    .transform((v, o) => (o === "" ? null : v))
    .nullable()
    .typeError("should be a number > 0"),
  
});

export const ModuleArObjectUpdateSchema = ModuleArObjectCreateSchema.concat(
  object().shape({
    status: number().required(),
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

export const ModuleArObjectMintableSchema = object().shape({
  setAsk: boolean(),
  askPrice: number().when("setAsk", {
    is: true, 
    then: number()
      .transform((v, o) => (o === "" ? null : v))
      .typeError("should be a number > 0")
      .required(),
    otherwise: number()
      .nullable(),
  }),
  editionOf: number()
      .transform((v, o) => (o === "" ? null : v))
      .typeError("should be a number > 0")
      .min(1)
      .max(100)
      .required(),  
});


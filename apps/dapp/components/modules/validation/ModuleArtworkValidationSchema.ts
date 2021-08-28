import { string, object, number, mixed } from "yup";

export const ModuleArtworkCreateSchema = object().shape({
  title: string().required(),
  description: string().nonEmptyHtml({ max: 500 }).required(),
  url: string().url().nullable(),
  video: string().url().nullable(), 
});


export const ModuleArtworkUpdateSchema = ModuleArtworkCreateSchema.concat(
  object().shape(
    {}
    
  )
);

export const ModuleArObjectCreateSchema = object().shape({
  title: string().required(),
  description: string().html({ max: 500 }),
  orderNumber: number().transform((v, o) => o === '' ? null : v).nullable().typeError('should be a number > 0'),
  askPrice: number().transform((v, o) => o === '' ? null : v).nullable().typeError('should be a number > 0'),
  editionOf: number().transform((v, o) => o === '' ? null : v).nullable().typeError('should be a number > 0').min(1).max(100),  
});


export const ModuleArObjectUpdateSchema = ModuleArObjectCreateSchema.concat(
  object().shape(
    {
      heroImage: number().required().nullable().typeError('Please upload an image'),
      modelGlb: number().required().nullable().typeError('Please upload your .gbl or .gltf model'),
      modelUsdz: number().required().nullable().typeError('Please upload your .usdz file'),
    }
    
  )
);
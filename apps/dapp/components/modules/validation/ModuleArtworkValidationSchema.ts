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
  orderNumber: number(),
  editionOf: number(),  
});


export const ModuleArObjectUpdateSchema = ModuleArObjectCreateSchema.concat(
  object().shape(
    {}
    
  )
);
import { string, object, number, mixed } from "yup";

export const ModuelArtworkCreateSchema = object().shape({
  title: string().required(),
  description: string().nonEmptyHtml({ max: 500 }).required(),
  url: string().url().nullable(),
  video: string().url().nullable(), 
});


export const ModuleArtworkUpdateSchema = ModuelArtworkCreateSchema.concat(
  object().shape(
    {}
    
  )
);
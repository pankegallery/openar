import { string, object, number, mixed } from "yup";

export const ModuleArtworkCreateSchema = object().shape({
  pseudonym: string().nullable(),
  email: string().email().required(),
  url: string().url().nullable(),
  bio: string().nullable(), 
});


export const ModuleLocationUpdateSchema = ModuleArtworkCreateSchema.concat(
  object().shape(
    activeLanguages.reduce(
      (acc: any, lang: any) => ({
        ...acc,
        [`heroImage_alt_${lang}`]:
          lang === defaultLanguage
            ? mixed().when("heroImage", {
                is: (value: any) => value && !isNaN(value) && value > 0,
                then: string().required(),
                otherwise: string(),
              })
            : string(),
        [`heroImage_credits_${lang}`]:
          lang === defaultLanguage
            ? mixed().when("heroImage", {
                is: (value: any) => value && !isNaN(value) && value > 0,
                then: string().required(),
                otherwise: string(),
              })
            : string(),
      }),
      {
        // t("validation.image.required", "Please upload an image")
        // heroImage: mixed().test(
        //   'is-required-image',
        //   'validation.image.required',
        //   (value) => {
        //     return (value && !isNaN(value) && value > 0)
        //   },
        // ),
      } as any
    )
  )
);
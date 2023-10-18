import { string, object, number, boolean, mixed } from "yup";
import { validateBidOrAsk, Decimal } from "@openar/crypto";
import { appConfig } from "~/config";
import { ArObjectStatusEnum } from "~/utils";

export const ModuleExhibitionCreateSchema = object().shape({
  title: string().required(),
  slug: string().matches(/[\w-]/).required("Lowercase letters and dashes only."),
  dateBegin: string().required("Required"),
  dateEnd: string().required("Required"),
  subtitlePrefix: string().required("Please define a prefix."),  
  description: string().nonEmptyHtml({ max: 750 }).required(),
  url: string().url().nullable(),
  video: string().url().nullable(),
  curators: string().required("Select at least one curator."),  
});

export const ModuleExhibitionUpdateSchema = ModuleExhibitionCreateSchema.concat(
  object().shape({
    status: number().required().typeError("Please select the publish state"),
  })
);
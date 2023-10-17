import { string, object, number, boolean, mixed } from "yup";
import { validateBidOrAsk, Decimal } from "@openar/crypto";
import { appConfig } from "~/config";
import { ArObjectStatusEnum } from "~/utils";

export const ModuleExhibitionCreateSchema = object().shape({
  title: string().required(),
  slug: string().matches(/[\w-]/).required(),
  dateBegin: string().required(),
  dateEnd: string().required(),
  subtitlePrefix: string().required(),
  description: string().nonEmptyHtml({ max: 750 }).required(),
  url: string().url().nullable(),
  video: string().url().nullable(),
  curators: string().required(),
});

export const ModuleExhibitionUpdateSchema = ModuleExhibitionCreateSchema.concat(
  object().shape({
    status: number().required().typeError("Please select the publish state"),
  })
);
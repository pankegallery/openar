import React from "react";
import { imageDeleteMutationGQL } from "~/graphql/mutations";

import { DocumentNode } from "@apollo/client";
import { Box, chakra, Flex, Grid } from "@chakra-ui/react";
import { FieldImageUploader } from ".";

import { useFormContext } from "react-hook-form";
import { useConfigContext } from "~/providers";

export interface FieldSingleImageSettings {
  imageRequired?: boolean;
  altRequired?: boolean;
  creditsRequired?: boolean;
  placeholder?: string;
  valid?: boolean;
  minFileSize?: number;
  maxFileSize?: number;
  aspectRatio?: number;
  sizes?: string;
}

export interface FieldSingleImageOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export const FieldSingleImage = ({
  settings,
  id,
  label,
  name,
  deleteButtonGQL = imageDeleteMutationGQL,
  currentImage,
  connectWith,
}: {
  settings: FieldSingleImageSettings;
  id: string;
  deleteButtonGQL?: DocumentNode;
  isDisabled?: boolean;
  label: string;
  name: string;
  currentImage: Record<string, any>;
  connectWith?: any;
}) => {
  const config = useConfigContext();
  const { setValue, getValues } = useFormContext();

  // TODO: Fix layout
  return (
    <chakra.fieldset
      border="1px solid"
      borderColor="gray.400"
      p="4"
      borderRadius="md"
      w="100%"
    >
      <legend>
        <chakra.span px="2">{label}</chakra.span>
      </legend>
      <Grid
        templateColumns={{ base: "100%", t: "max(20%,320px) 1fr" }}
        templateRows={{ base: "auto 1fr", t: "auto" }}
        gap={{ base: "4", s: "6" }}
      >
        <Box>
          <Box
            w={{ base: "100%", t: "100%" }}
            maxW={{ base: "350px", t: "100%" }}
          >
            <FieldImageUploader
              name={`${name}`}
              id={`${id}`}
              label="Image"
              isRequired={!!settings.imageRequired}
              deleteButtonGQL={deleteButtonGQL}
              connectWith={connectWith}
              onDelete={() => {
                setValue(`${name}`, "");
              }}
              settings={{
                minFileSize: settings?.minFileSize ?? 1024 * 1024 * 0.0977,
                maxFileSize: settings?.maxFileSize ?? 1024 * 1024 * 3,
                aspectRatioPB: settings?.aspectRatio ?? 75, // % bottom padding

                image: {
                  status: currentImage?.status,
                  id: currentImage?.id,
                  meta: currentImage?.meta,
                  alt: label,
                  forceAspectRatioPB: settings?.aspectRatio ?? 75,
                  showPlaceholder: true,
                  sizes: settings?.sizes ?? "(min-width: 45em) 20v, 95vw",
                },
              }}
            />
          </Box>
        </Box>
      </Grid>
      <Flex flexWrap="wrap"></Flex>
    </chakra.fieldset>
  );
};

export default FieldSingleImage;

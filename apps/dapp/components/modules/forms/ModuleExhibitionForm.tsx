import { useEffect, useState } from "react";
import { imageDeleteMutationGQL } from "~/graphql/mutations";
// import { useQuery } from "@apollo/client";
// import { usersQueryGQL } from "~/graphql/queries";
import { AspectRatio, Box, Grid, chakra } from "@chakra-ui/react";

import {
  FieldInput,
  FieldRow,
  FieldTextEditor,
  FieldSwitch,
  FieldImageUploader,
  FieldSingleDate,
  FieldAutocomplete,
} from "~/components/forms";

import { IncompleteOverlay, ShowUrlAndCopy } from "~/components/frontend";
import { ModuleArtworkArObjectsList } from ".";

import { yupIsFieldRequired } from "../validation";
import { useFormContext } from "react-hook-form";
import { appConfig } from "~/config";


export const ModuleExhibitionForm = ({
  action,
  data,
  errors,
  validationSchema,
  disableNavigation,
  setActiveUploadCounter,
}: {
  action: string;
  data?: any;
  errors?: any;
  validationSchema: any;
  setActiveUploadCounter?: Function;
  disableNavigation?: Function;
}) => {
  // const { exhibitionReadOwn } = data ?? {};
  // Workaround
  const { exhibitionReadOwn } = data ?? {
    id: 3,
    title: "Animal()City",
    slug: "animal-city",
    imgUrl:
      "https://baserow.panke.gallery/media/user_files/EvoXClGpi1pvLnUZetcaDRlPSdtOfOfL_5e2e167834bb0c9302fa0df477b42e16e2228c8fad4975b473d5621d4215490d.jpg",
    imgPosition: "center center",
    type: "groupshow",
    // A group show curated by ABC and BBB
    subtitlePrefix: "A group show curated by",
    // curators: [
    //   {
    //     orderNumber: 1,
    //     user: await getExhibitionUserById(18),
    //   },
    // ],
    dateBegin: new Date("2023-10-12 12:00"),
    dateEnd: new Date("2023-10-28 23:00"),
    description: `Animal()City is inspired by the ghostly presence of foxes roaming the city at night – a common sight in Berlin today – evoking echoes of a pre-industrial era while drawing attention to a layer of the city that is completely invisible in everyday life. In these moments we witness animals and plants forming their own realm, and the city having a life of its own, acting like an entity, a ghost at times. Encounters with wild animals in the city make this parallel identity momentarily tangible, making us part of these ‘non-human’ networks while projecting ideas of dystopian, dehumanised cities of the future. The city can also be read as analogous to the Internet. Just as we are divided into threads and channels by platforms online, we also live in multi-layered structures that are haunted by sinister bots and AI agents.`,
    // status: ExhibitionStatusEnum.PUBLISHED,
    // artworks: await getExhibitionArtworks([
    //   "I3MUhwLxici21RF5",
    //   "AI1A7yQdHQlTuNp0",
    //   "fFllpSvUuvXL7zIo",
    //   "kUIayNJbpHl5Sa7C",
    //   "GSpeSfy655rVWERY",
    //   "Athl28wGaJZRva25",
    //   "wAjMr9jSxgoZ2QCM",
    // ]),
  };

  const href = `${appConfig.baseUrl}/a/${data?.exhibitionReadOwn?.key}/`;

  const columns = { base: "100%", t: "50% 50%" };
  const rows = { base: "auto 1fr", t: "1fr" };

  const { watch } = useFormContext();

  const [isPublic] = watch(["isPublic"]);

  // TODO: Populate Array with users
  const curatorArray = [
    { value: "16", label: "Sakrowski" },
    { value: "18", label: "Other user" },
  ];
  // const allUsers = useQuery(usersQueryGQL, {
  //   variables: {
  //     orderBy: {users: "pseudonym"},
  //     pageIndex: 0,
  //     pageSize: 100,
  //   },
  // });
  // console.log(curatorArray, allUsers.data);

  const [currentTitleValue, setCurrentTitleValue] = useState<String>("");
  const [slugDefault, setSlugDefault] = useState<String>("");
  useEffect(() => {
    // if (focused) {
    //   inputRef.current.focus()
    // } else {
    //   inputRef.current.blur()
    // }
  }, [slugDefault]);

  const createSlugFromTitle = (t: any) => {
    console.log("event:", t);

    let slug = t
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setSlugDefault(slug);
  };

  return (
    <Grid
      templateColumns={columns}
      templateRows={rows}
      minH="calc(100vh - 4rem)"
    >
      <Box>
        <FieldRow>
          <FieldInput
            name="title"
            id="title"
            type="text"
            label="Exhibition title"
            isRequired={yupIsFieldRequired("title", validationSchema)}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "Insert exhibition title…",
              onChange: (event) =>
                setCurrentTitleValue((event.target as HTMLButtonElement).value),
              onBlur: (event) => createSlugFromTitle(currentTitleValue),
            }}
          />
          <FieldInput
            name="slug"
            id="slug"
            type="slug"
            label="Exhibition slug"
            isRequired={yupIsFieldRequired("slug", validationSchema)}
            settings={{
              defaultValue: slugDefault,
              placeholder: "Insert exhibition slug…",
              helpText:
                "The slug may only contain lowercase letters and dashes.",
            }}
          />
        </FieldRow>
        <FieldRow col={true}>
          <FieldSingleDate
            name="dateBegin"
            id="dateBegin"
            label="Start date"
            placeholder="Pick date…"
            isRequired={yupIsFieldRequired("dateBegin", validationSchema)}
          />
          <FieldSingleDate
            name="dateEnd"
            id="dateEnd"
            label="End date"
            placeholder="Pick date…"
            isRequired={yupIsFieldRequired("dateEnd", validationSchema)}
          />
        </FieldRow>
        <FieldRow>
          <FieldAutocomplete
            name="curators"
            items={curatorArray}
            id="curators"
            label="Curators"
            isRequired={yupIsFieldRequired("curators", validationSchema)}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "Select curators or search by alias…",
              helpText:
                "Curators must be registrated users of openAR to be selected",
            }}
          />
          <FieldInput
            name="subtitlePrefix"
            id="subtitlePrefix"
            type="text"
            label="Exhibition tagline"
            isRequired={yupIsFieldRequired("subtitlePrefix", validationSchema)}
            settings={{
              // defaultValue: data.abc.key
              placeholder: "A group show/exhibition/show",
              helpText: "Tagline prefix will be completed by list of curators",
              rightElement: {
                element: <span>by [list of curators].</span>,
                padding: "14em",
              },
            }}
          />
        </FieldRow>
        <FieldRow>
          <FieldTextEditor
            id="description"
            type="basic"
            name="description"
            label="Exhibition description"
            isRequired={yupIsFieldRequired("description", validationSchema)}
            settings={{
              maxLength: 750,
              defaultValue: exhibitionReadOwn?.description
                ? exhibitionReadOwn?.description
                : undefined,
              placeholder: "Please describe the exhibition in a few words…",
            }}
          />
        </FieldRow>
        {action === "update" && (
          <Box borderBottom="1px solid #fff">
            <FieldSwitch
              name="isPublic"
              label="Is you exhibition public?"
              isRequired={yupIsFieldRequired("isPublic", validationSchema)}
              defaultChecked={exhibitionReadOwn?.isPublic}
              hint={
                isPublic
                  ? "Your exhibition is visible on openAR"
                  : "Your exhibition will be hidden on openAR. You can always access your exhibition via:"
              }
            />
            {!isPublic && (
              <Box px="6" pb="6" mt="-1rem">
                <ShowUrlAndCopy url={href} />
              </Box>
            )}
          </Box>
        )}
      </Box>
      <Box
        w={{ base: "100%", t: "auto" }}
        minH="100%"
        borderLeft="1px solid #fff"
        position="relative"
      >
        {/* ---- OVERLAY: Save to upload --- */}
        {action === "create" && (
          <IncompleteOverlay
            headline="Save draft to add artworks."
            subline=" Please save as draft to unlock artowkr and poster fields."
            button={true}
            buttonLabel="Save draft"
            href=""
            height="100%"
            marginLeft="20"
            marginTop="60"
            align="top"
          />
        )}

        {/* ---- BOX: Fake content behind --- */}

        {action === "create" && (
          <>
            <Box p="6" borderBottom="1px solid #fff">
              <chakra.p textStyle="label">Poster image</chakra.p>
              <chakra.p textStyle="small">
                The poster image is shown in artwork streams and exhibitions.
              </chakra.p>
              <AspectRatio
                ratio={1}
                border="4px dashed white"
                mt="6"
                position="static"
              >
                <Box textAlign="center" position="static"></Box>
              </AspectRatio>
            </Box>
            <Box p="6" borderBottom="1px solid #fff">
              <chakra.p textStyle="label">Artwork objects</chakra.p>
              <chakra.p textStyle="small">
                Click to edit, drag to change order.
              </chakra.p>
              <AspectRatio
                ratio={1}
                border="4px dashed white"
                mt="6"
                position="static"
                display="inline-flex"
                width="48%"
                mr="4%"
              >
                <Box textAlign="center" position="static"></Box>
              </AspectRatio>
              <AspectRatio
                ratio={1}
                display="inline-flex"
                border="4px dashed white"
                mt="6"
                position="static"
                width="48%"
              >
                <Box textAlign="center" position="static"></Box>
              </AspectRatio>
            </Box>
          </>
        )}

        {action === "update" && (
          //TODO: Replace dummy content with fields from below
          <Box borderBottom="1px solid #fff" p="6">
            <FieldImageUploader
              route="image"
              id="heroImage"
              name="heroImage"
              label="Poster Image"
              isRequired={yupIsFieldRequired("heroImage", validationSchema)}
              setActiveUploadCounter={setActiveUploadCounter}
              deleteButtonGQL={imageDeleteMutationGQL}
              connectWith={{
                heroImageArtworks: {
                  connect: {
                    id: exhibitionReadOwn.id,
                  },
                },
              }}
              settings={{
                // minFileSize: 1024 * 1024 * 0.0488,
                maxFileSize: 1024 * 1024 * 5,
                aspectRatioPB: 100, // % bottom padding

                image: {
                  status: exhibitionReadOwn?.heroImage?.status,
                  id: exhibitionReadOwn?.heroImage?.id,
                  meta: exhibitionReadOwn?.heroImage?.meta,
                  alt: `Poster Image`,
                  forceAspectRatioPB: 100,
                  showPlaceholder: true,
                  sizes: "(min-width: 45em) 20v, 95vw",
                },
                helpText:
                  "The poster image is shown in artwork streams and exhibitions. Leave empty to use the first published object’s poster image.",
              }}
            />
          </Box>
        )}
        {action === "update" && (
          <>
            {/* V2: <Box borderBottom="1px solid #fff">
              <FieldRow>
                <FieldSwitch
                  name="multipleObjects"
                  label="Mulitple object"
                  isRequired={yupIsFieldRequired(
                    "multipleObjects",
                    validationSchema
                  )}
                  hint="The artwork consists of multiple objects."
                />
              </FieldRow>
            </Box> */}
            <Box borderBottom="1px solid #fff" p="6">
              <ModuleArtworkArObjectsList
                {...{
                  data,
                  errors,
                  validationSchema,
                  disableNavigation,
                  setActiveUploadCounter,
                }}
              />
            </Box>
          </>
        )}
      </Box>
    </Grid>
  );
};
export default ModuleExhibitionForm;

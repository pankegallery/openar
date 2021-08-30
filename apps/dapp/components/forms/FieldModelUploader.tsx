import React, { useState, useMemo, ChangeEventHandler, useEffect } from "react";
import axios from "axios";
import { DocumentNode } from "@apollo/client";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Flex,
  FormControl,
  FormLabel,
  chakra,
  IconButton,
  Text,
} from "@chakra-ui/react";

import { HiOutlineTrash } from "react-icons/hi";
import { ImCancelCircle } from "react-icons/im";

import {
  useAuthentication,
  useDeleteByIdButton,
  useAxiosCancelToken,
} from "~/hooks";

import { useFormContext } from "react-hook-form";

import { FieldErrorMessage } from ".";

import { authentication } from "~/services";
import { appConfig } from "~/config";
import { ArModelStatusEnum } from "~/utils";
import type { ApiArModelMetaInformation } from "~/types";
import { ApiArModel } from "~/components/ui";

export type ApiArModelProps = {
  id: number | undefined;
  status: ArModelStatusEnum;
  meta?: ApiArModelMetaInformation;
  placeholder?: string;
};


const humanFileSize = (
  size: number | undefined,
  decimalPlaces: number = 0
): string => {
  if (!size || size === 0) return "0";
  const i: number = Math.floor(Math.log(size) / Math.log(1024));
  return `${(size / Math.pow(1024, i)).toFixed(decimalPlaces)} ${
    ["B", "KB", "MB", "GB", "TB"][i]
  }`;
};

const baseStyle = {
  boxSizing: "border-box",
  p: "4",
  position: "absolute",
  t: 0,
  l: 0,
  w: "100%",
  h: "100%",
  borderWidth: 4,
  borderColor: "white",
  borderStyle: "dashed",
  backgroundColor: "transparent",
  color: "white",
  outline: "none",
  transition: "all .24s ease-in-out",
  cursor: "pointer",

  _hover: {
    bg: "openarGreen.400",
  },
};

const activeStyle = {
  bg: "orange.200",
};

const acceptStyle = {
  bg: "green.300",
  _hover: {
    bg: "green.300",
  },
};

const rejectStyle = {
  bg: "red.400",
  _hover: {
    bg: "red.400",
  },
};

export interface FieldModelUploaderSettings {
  onChange?: ChangeEventHandler;
  required?: boolean;
  className?: string;
  placeholder?: string;
  imageIdAsFieldValue?: boolean;
  valid?: boolean;
  accept?: string;
  minFileSize?: number; // in bytes 1024 * 1024 = 1MB
  maxFileSize?: number; // in bytes 1024 * 1024 = 1MB
  model?: ApiArModelProps;
}

export type FieldModelUploaderProgessInfo = {
  loaded: number;
  total: number;
  percent: number;
};

const initialProgressInfo: FieldModelUploaderProgessInfo = {
  loaded: 0,
  total: 0,
  percent: 0,
};

export const FieldModelUploader = ({
  settings,
  id,
  label,
  name,
  type,
  isRequired,
  isDisabled,
  deleteButtonGQL,
  onDelete,
  onUpload,
  connectWith,
  route = "model",
  setActiveUploadCounter,
  shouldSetFormDirtyOnUpload = false,
  shouldSetFormDirtyOnDelete = false,
}: {
  settings?: FieldModelUploaderSettings;
  id: string;
  isRequired?: boolean;
  isDisabled?: boolean;
  shouldSetFormDirtyOnUpload?: boolean;
  shouldSetFormDirtyOnDelete?: boolean;
  label: string;
  name: string;
  type: string;
  deleteButtonGQL: DocumentNode;
  onDelete?: (id?: number) => void;
  onUpload?: (id?: number) => void;
  setActiveUploadCounter?: Function;
  connectWith?: any;
  route?: string;
}) => {
  const [appUser] = useAuthentication();

  const { createNewCancelToken, isCancel, getCancelToken, getCanceler } =
    useAxiosCancelToken();
  const [progressInfo, setProgressInfo] =
    useState<FieldModelUploaderProgessInfo>(initialProgressInfo);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadError, setIsUploadError] = useState(false);
  const [uploadedModelId, setUploadedImgId] = useState();
  const [arModelIsDeleted, setArModelIsDeleted] = useState(false);
  const [uploadedModelUrl, setUploadedModelUrl] = useState("");
  const [showFileDropError, setShowFileDropError] = useState(false);
  const [fileDropError, setFileDropError] = useState("");

  const {
    formState: { errors },
    register,
    clearErrors,
    setValue,
  } = useFormContext();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    maxSize: settings?.maxFileSize ?? 1024 * 1024 * 2,
    minSize: settings?.minFileSize ?? undefined,
    disabled: isDisabled,
    multiple: false,
    accept: settings?.accept ?? undefined,
    onDropRejected: async (files) => {
      const file = files.shift();

      if (!file || file.errors.length === 0) return;

      setShowFileDropError(true);
      setFileDropError(file.errors[0].code);
    },
    onDropAccepted: async (files) => {
      try {
        if (appUser) {
          setIsUploading(true);
          setIsUploadError(false);
          setUploadedModelUrl("");

          const formData = new FormData();
          formData.append("model", files[0]);
          formData.append("ownerId", `${appUser.id}`);
          formData.append("type", type);
          formData.append("connectWith", JSON.stringify(connectWith));

          const cancelToken = createNewCancelToken();

          if (setActiveUploadCounter)
            setActiveUploadCounter((state: number) => state + 1);

          await axios
            .request({
              method: "post",
              url: `${appConfig.apiUrl}/${route}`,
              headers: {
                "Content-Type": "multipart/form-data",
                ...(authentication.getAuthToken()
                  ? { authorization: `Bearer ${authentication.getAuthToken()}` }
                  : {}),
              },
              cancelToken,
              withCredentials: true,
              data: formData,
              onUploadProgress: (ev) => {
                if (getCancelToken())
                  setProgressInfo({
                    loaded: ev.loaded,
                    total: ev.total,
                    percent: Math.round((ev.loaded / ev.total) * 100),
                  });
              },
            })
            .then(({ data }) => {
              if (getCancelToken()) {
                setIsUploading(false);

                if (setActiveUploadCounter)
                  setActiveUploadCounter((state: number) => state - 1);

                if (data?.id) {
                  clearErrors(name);
                  setUploadedImgId(data?.id ?? undefined);
                  setUploadedModelUrl(data?.meta?.originalFileUrl)
                  setValue(name, data?.id, {
                    shouldDirty: shouldSetFormDirtyOnDelete,
                  });
                  if (typeof onUpload === "function")
                    onUpload.call(this, data?.id);
                }
              }
            })
            .catch((error) => {
              if (setActiveUploadCounter)
                setActiveUploadCounter((state: number) => state - 1);

              if (isCancel(error)) return;

              if (getCancelToken()) {
                setIsUploading(false);
                setProgressInfo(initialProgressInfo);
                setIsUploadError(true);
              }
            });
        }
      } catch (err) {
        console.error(err);
      }
    },
  });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? { activeStyle } : {}),
      ...(isDragAccept || isUploading ? acceptStyle : {}),
      ...(isDragReject || showFileDropError ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept, isUploading, showFileDropError]
  );

  const [deleteButtonOnClick, DeleteAlertDialog, isDeleteError] =
    useDeleteByIdButton(
      deleteButtonGQL,
      () => {
        setUploadedModelUrl("");
        setUploadedImgId(undefined);
        setArModelIsDeleted(true);
        setIsUploading(false);
        setValue(name, undefined, { shouldDirty: shouldSetFormDirtyOnUpload });
        if (typeof onDelete === "function") onDelete.call(null);
      },
      {
        requireTextualConfirmation: false,
      }
    );

  let currentModel: any =
    settings?.model && settings?.model?.id ? settings.model : {};

  if (arModelIsDeleted) currentModel = {};
  
  const showModel = (currentModel && currentModel?.id) || uploadedModelUrl !== "";

  const hasMin = settings?.minFileSize && settings?.minFileSize > 0;
  const hasMax = settings?.maxFileSize && settings?.maxFileSize > 0;
  let fileSizeInfo = "";

  if (hasMin && hasMax) {
    fileSizeInfo = `Size between ${humanFileSize(
      settings?.minFileSize,
      1
    )} and ${humanFileSize(settings?.maxFileSize, 1)}`;
  } else if (hasMax) {
    fileSizeInfo = `Size max. ${humanFileSize(settings?.maxFileSize, 1)}`;
  } else if (hasMin) {
    fileSizeInfo = `Size min. ${humanFileSize(settings?.minFileSize, 1)}`;
  }

  useEffect(() => {
    if (fileDropError === "") return;

    const timeout = setTimeout(() => {
      setFileDropError("");
      setShowFileDropError(false);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [fileDropError, setFileDropError, setShowFileDropError]);

  let fileDropErrorMessage = "";

  switch (fileDropError) {
    case "file-too-large":
      fileDropErrorMessage = "Chosen file is too large";
      break;
    case "file-too-small":
      fileDropErrorMessage = "Chosen file is too small";
      break;
    case "file-invalid-type":
      fileDropErrorMessage = "Type of chosen file is not accepted";
      break;
  }

  let urlGlb;
  if (type === "glb")
  urlGlb = uploadedModelUrl || currentModel?.meta?.originalFileUrl;

  let urlUsdz;
  if (type === "usdz")
    urlUsdz = uploadedModelUrl || currentModel?.meta?.originalFileUrl;

  return (
    <>
      <FormControl
        id={id}
        isInvalid={errors[name]?.message || isDragReject}
        {...{ isRequired, isDisabled }}
      >
        <FormLabel htmlFor={id} mb="0.5">
          {label}
        </FormLabel>
        {showModel && (
          <Box position="relative">

            <ApiArModel
              urlGlb={(type === "glb" && urlGlb) ? urlGlb : undefined}
              urlUsdz={(type === "usdz" && urlUsdz) ? urlUsdz  : undefined}
              alt={`AR Model ${type}`}
              loading="eager"
              reveal="auto"
              autoplay={true}
              enforceAspectRatio={true}
            />

            <IconButton
              position="absolute"
              top="3"
              right="3"
              fontSize="xl"
              icon={<HiOutlineTrash />}
              onClick={() => {
                deleteButtonOnClick(uploadedModelId ?? currentModel?.id);
              }}
              aria-label="Delete model"
              title="Delete model"
            />
          </Box>
        )}
        {isDeleteError && (
          <Text fontSize="sm" mt="0.5" color="red.500">
            Unfortunately, we could not process you deletion request please try
            again later
          </Text>
        )}
        {DeleteAlertDialog}

        {!showModel && (
          <>
            <input name={`${name}_dropzone`} {...getInputProps()} />

            <Box
              position="relative"
              pb="100%"
              h="0"
              w="100%"
            >
              <Flex
                {...getRootProps({ className: "dropzone" })}
                justifyContent="center"
                textAlign="center"
                alignItems="center"
                flexDirection="column"
                sx={style}
              >
                {(!isUploading || progressInfo.total < 0.01) && (
                  <>
                    {showFileDropError && (
                      <Text color="white" fontWeight="bold">
                        {fileDropErrorMessage}
                      </Text>
                    )}
                    {!showFileDropError && (
                      <Text w="90%">
                        {"Drag & drop your model here, or click to select one"}
                      </Text>
                    )}

                    {fileSizeInfo && <Text fontSize="sm">{fileSizeInfo}</Text>}
                  </>
                )}

                {isUploading && progressInfo.total > 0.01 && (
                  <>
                    <chakra.span fontSize="md">
                      Uploading
                      <br />
                      <chakra.span fontSize="xl">
                        {`${Math.round(
                          (progressInfo.loaded / progressInfo.total) * 100
                        )}`}
                        %
                      </chakra.span>
                    </chakra.span>

                    <IconButton
                      position="absolute"
                      top="3"
                      right="3"
                      fontSize="2xl"
                      icon={<ImCancelCircle />}
                      color="red.600"
                      bg="white"
                      borderColor="gray.600"
                      _hover={{
                        bg: "red.100",
                      }}
                      onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        const canceler = getCanceler();
                        if (typeof canceler === "function") canceler();
                        setIsUploading(false);
                      }}
                      aria-label="Cancel upload"
                      title="Cancel upload"
                    />
                  </>
                )}
              </Flex>
            </Box>
          </>
        )}
        {isUploadError && (
          <Text fontSize="sm" mt="0.5" color="red.500">
            Unfortunately, we could not finish you upload please try again later
          </Text>
        )}

        <input
          {...{ valid: !errors[name]?.message ? "valid" : undefined }}
          type="hidden"
          defaultValue={currentModel?.id}
          {...register(name, {
            required: isRequired,
          })}
        />

        <FieldErrorMessage error={errors[name]?.message} />
      </FormControl>
    </>
  );
};

export default FieldModelUploader;

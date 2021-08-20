import React, { useState } from "react";
import { DocumentNode, useMutation } from "@apollo/client";
import {
  useSuccessfullyDeletedToast,
  useAuthentication,
} from "~/hooks";
import {useConfigContext} from "~/providers";

import { DangerZoneAlertDialog } from "~/components/ui";

type dZADState = {
  open: boolean;
  id: number | undefined;
};

type useDeleteByIdButtonOptions = {
  requireTextualConfirmation?: boolean;
  title?: string;
  message?: string;
};

export const useDeleteByIdButton = (
  deleteMutationGQL: DocumentNode,
  refetch: () => void,
  options?: useDeleteByIdButtonOptions
) => {
  const { requireTextualConfirmation = false, title, message } = options ?? {};

  const [appUser] = useAuthentication();
  const config = useConfigContext();
  const [deleteMutation, { loading, error, data }] =
    useMutation(deleteMutationGQL);
  const successfullyDeletedToast = useSuccessfullyDeletedToast();
  const [dZAD, setDZAD] = useState<dZADState>({
    open: false,
    id: undefined,
  });
  const [isDeleteError, setIsDeleteError] = useState(false);

  const deleteButtonOnClick = (id: number) => {
    setDZAD({
      open: true,
      id,
    });
  };

  const onDeleteNo = () => {
    setDZAD({
      open: false,
      id: undefined,
    });
  };

  const onDeleteYes = async () => {
    try {
      if (appUser) {
        const { errors } = await deleteMutation({
          variables: {
            id: dZAD.id,
          },
        });
        if (!errors) {
          setDZAD({
            open: false,
            id: undefined,
          });

          refetch.call(null);

          setIsDeleteError(false);
          successfullyDeletedToast();
        } else {
          setIsDeleteError(true);
          setDZAD({
            open: false,
            id: undefined,
          });
        }
      } else {
        setIsDeleteError(true);
        setDZAD({
          open: false,
          id: undefined,
        });
      }
    } catch (err) {
      setIsDeleteError(true);
      setDZAD({
        open: false,
        id: undefined,
      });
    }
  };

  const DZAD = (
    <DangerZoneAlertDialog
      title={title ? title : "Please confirm"}
      message={
        message
          ? message
          : "Do you really want to delete the user? Once done we cannot revert this action!"
      }
      requireTextualConfirmation={requireTextualConfirmation}
      isOpen={dZAD.open}
      onNo={onDeleteNo}
      onYes={onDeleteYes}
    />
  );

  return [
    deleteButtonOnClick,
    DZAD,
    isDeleteError,
    {
      deleteMutationLoading: loading,
      deleteMutationError: error,
      deleteMutationData: data,
    },
  ] as const;
};

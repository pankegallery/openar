import { useToast, UseToastOptions } from "@chakra-ui/react";

export const useAppToast = (
  defaultTitle: string,
  defaultMsg: string,
  status: UseToastOptions["status"]
) => {
  const toast = useToast();

  const trigger = (title: string = defaultTitle, msg: string = defaultMsg) => {
    toast({
      title: title,
      description: msg,
      status,
      duration: 6000,
      isClosable: true,
      variant: "subtle",
      position: "bottom-right",
    });
  };

  return trigger;
};

export const useSuccessfullySavedToast = () => {
  const defaultTitle = "Success!";
  const defaultMsg = "The data has been saved";

  const toast = useAppToast(defaultTitle, defaultTitle, "success");

  const trigger = (title: string = defaultTitle, msg: string = defaultMsg) => {
    toast(title, msg);
  };

  return trigger;
};

export const useSuccessfullyDeletedToast = () => {
  const defaultTitle = "Success!";
  const defaultMsg = "The data has been deleted";

  const toast = useAppToast(defaultTitle, defaultTitle, "success");

  const trigger = (title: string = defaultTitle, msg: string = defaultMsg) => {
    toast(title, msg);
  };

  return trigger;
};

import { useState } from "react";
import {
  Box,
  Alert,
  Icon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  useMediaQuery,
  Grid,
} from "@chakra-ui/react";
import { AiOutlineAlert, AiOutlineInfoCircle } from "react-icons/ai";
import { HiOutlineCheck } from "react-icons/hi";

export const AlertBox = ({
  status,
  title,
  twoCol = false,
  description,
  children,
  hasClose = false,
}: {
  children?: React.ReactNode;
  title?: string;
  description?: string;
  status: "warning" | "success" | "info" | "error";
  hasClose?: boolean;
  twoCol?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [tw] = useMediaQuery("(min-width: 55em)");

  if (!isOpen) return <></>;

  let icon = AiOutlineAlert;

  if (status === "success") icon = HiOutlineCheck;

  if (status === "info") icon = AiOutlineInfoCircle;

  return (
    <Alert
      bg={status === "info" ? "gray.200" : undefined}
      variant="subtle"
      status={status}
      mb={{ base: 3, tw: 4 }}
      borderRadius="lg"
      shadow="md"
    >
      <Grid
        templateColumns={hasClose ? "32px 1fr 32px" : "32px 1fr"}
        alignItems={!tw || (tw && !twoCol) ? "start" : "center"}
        gap="2"
        w="100%"
      >
        <Icon
          fontSize="2xl"
          as={icon}
          transform={!tw || (tw && !twoCol) ? "translateY(20%)" : undefined}
        >
          Your browser is outdated!
        </Icon>
        <Box
          display="flex"
          flexDirection={tw && twoCol ? "row" : "column"}
          alignItems={tw && twoCol ? "center" : "flex-start"}
        >
          {title && <AlertTitle mr={2}>{title}</AlertTitle>}
          {description && <AlertDescription>{description}</AlertDescription>}

          {children}
        </Box>
        {hasClose && (
          <CloseButton
            fontSize="md"
            transform="translateX(20%)"
            onClick={() => setIsOpen(false)}
          />
        )}
      </Grid>
    </Alert>
  );
};
export default AlertBox;

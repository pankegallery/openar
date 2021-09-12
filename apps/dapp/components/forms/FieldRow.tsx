import React from "react";
import { Flex, Text, Box } from "@chakra-ui/react";

export const FieldRow = ({
  children,
  col,
  isDangerZone,
}: {
  children: React.ReactNode;
  col?  : Boolean;
  isDangerZone?: string;
}): JSX.Element | null => {
  if (isDangerZone)
    return (
      <Flex
        direction="column"
        _first={{ mt: 0 }}
        border="2px solid"
        borderColor="red"
        borderRadius="lg"
        padding="2"
      >
        <Text color="red" fontWeight="bold">
          {isDangerZone}
        </Text>
        {children}
      </Flex>
    );

  return (
    <Box 
      _first={{ mt: 0 }} 
      w="100%" 
      className="fieldRow" 
      display={col? "flex" : "block"}
      sx={{
        "& > *":{ borderLeft: "1px solid white"},
        "& > *:first-child":{ borderLeft: "none"},
      }}
    >
      {children}
    </Box>
  );
};

export default FieldRow;

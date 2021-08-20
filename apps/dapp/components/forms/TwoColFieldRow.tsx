import React from "react";
import { SimpleGrid, useBreakpointValue } from "@chakra-ui/react";

export const TwoColFieldRow = ({
  children,
  type,
}: {
  children: React.ReactNode;
  type?: "multilang" | undefined;
}): JSX.Element | null => {
  const spacing = useBreakpointValue({ base: 2, t: 6 });

  let props = {
    columns: { base: 1, t: 2 },
    spacing: 6,
    mt: 4,
  };

  if (type && type === "multilang") {
    props = {
      columns: { base: 1, t: 2 },
      spacing: spacing ?? 2,
      mt: 8,
    };
  }

  return (
    <SimpleGrid
      {...props}
      _first={{ mt: 0 }}
      sx={{
        "> div:nth-of-type(2n)": {
          mt: "0",
        },
      }}
      w="100%"
    >
      {children}
    </SimpleGrid>
  );
};

export default TwoColFieldRow;

import React, { useEffect } from "react";

import { ArrowLink } from "~/components/ui";
import Image from "next/image";

import {
  Box,
  Text,
  chakra,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";

export const RoleBadgeControl = ({ role }: { role: any }) => {
  const roleDisclosure = useDisclosure();

  return (
    <Box>
      {/* ------- Link ------- */}
      <ArrowLink onClick={roleDisclosure.onOpen}>{role.title}</ArrowLink>

      <Modal isOpen={roleDisclosure.isOpen} onClose={roleDisclosure.onClose}>
        <ModalOverlay bg="blackAlpha.800" />
        <ModalContent
          color="white"
          pt="0"
          bg="openar.muddygreen"
          borderRadius="0"
          w="80vw"
          maxWidth="600px"
        >
          <ModalHeader pb="4">About the {role.slug} role</ModalHeader>
          <ModalCloseButton fontSize="lg" />
          <ModalBody pb="6">
            <Text color="white">{role.description}</Text>
            {role.badges.map((badge) => (
              <Box key={role.slug}>
                <chakra.p textStyle="label" mt="10" mb="4">
                  {role.title} badge 2021
                </chakra.p>
                <Box display="block">
                  <Image
                    layout="responsive"
                    width="100%"
                    height="100%"
                    src={`/images/${badge.image}`}
                    alt={role.title}
                  />
                </Box>
                <chakra.p textStyle="label" mt="6">
                  Artist
                </chakra.p>
                <p>Created by {badge.artist}</p>
              </Box>
            ))}
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

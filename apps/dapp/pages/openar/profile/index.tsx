import { ReactElement } from "react";
import { userProfileReadQueryGQL } from "~/graphql/queries";

import { useQuery } from "@apollo/client";
import { Stat, StatLabel, StatNumber, Box, Grid } from "@chakra-ui/react";

import {
  ModuleSubNav,
  ModulePage,
  ButtonListElement,
} from "~/components/modules";

import { RestrictPageAccess } from "~/components/utils";

import { moduleProfileConfig } from "~/components/modules/config";
import { useAuthentication } from "~/hooks";
import { ApiImage } from "~/components/ui";
import { LayoutOpenAR } from "~/components/app";

const Index = () => {
  const [appUser] = useAuthentication();

  const { data, loading, error } = useQuery(userProfileReadQueryGQL, {
    variables: {
      id: appUser?.id ?? 0,
    },
  });

  const breadcrumb = [
    {
      path: moduleProfileConfig.rootPath,
      title: "Profile",
    },
  ];

  const buttonList: ButtonListElement[] = [
    {
      type: "navigation",
      to: "/openar/profile/update",
      label: "Update profile",
      userCan: "profileUpdate",
    },
    // {
    //   type: "navigation",
    //   to: "/profile/password",
    //   label: t("module.profile.button.updatepassword", "Update password"),
    //   userCan: "profileUpdate",
    // },
  ];

  console.log(data);

  const {
    ethAddress,
    pseudonym,
    bio,
    url,
    email,
    emailVerified,
    profileImage,
  } = data?.userProfileRead ?? {};

  const columns = { base: "100%", t: "1fr max(33.33%, 350px) " };
  const rows = { base: "auto 1fr", t: "1fr" };
  return (
    <>
      <ModuleSubNav breadcrumb={breadcrumb} buttonList={buttonList} />
      <ModulePage isLoading={loading} isError={!!error}>
        {ethAddress && (
          <Grid
            templateColumns={columns}
            templateRows={rows}
            minH="calc(100vh - 8rem)"
          >
            <Box p="4">
              <Stat mb="4">
                <StatLabel fontSize="md">Pseudonym</StatLabel>
                <StatNumber textTransform="capitalize" mt="-1">
                  {pseudonym}
                </StatNumber>
              </Stat>

              <Stat mb="4">
                <StatLabel fontSize="md">Ethereum Address</StatLabel>
                <StatNumber textTransform="capitalize" mt="-1">
                  {ethAddress}
                </StatNumber>
              </Stat>

              <Stat mb="4">
                <StatLabel fontSize="md">Bio</StatLabel>
                <StatNumber textTransform="capitalize" mt="-1">
                  {bio}
                </StatNumber>
              </Stat>

              <Stat mb="4">
                <StatLabel fontSize="md">Url</StatLabel>
                <StatNumber textTransform="capitalize" mt="-1">
                  {url}
                </StatNumber>
              </Stat>

              <Stat mb="4">
                <StatLabel fontSize="md">Email address</StatLabel>
                <StatNumber mt="-1">{email}</StatNumber>
              </Stat>

              <Stat mb="4">
                <StatLabel fontSize="md">Email verification status</StatLabel>
                <StatNumber mt="-1">
                  {emailVerified
                    ? "You've verified your email address"
                    : "You've not verified your email address. Check your inbox!"}
                </StatNumber>
              </Stat>
            </Box>
            <Box
              w={{ base: "50%", t: "auto" }}
              minH="100%"
              borderLeft="1px solid #fff"
            >
              <ApiImage
                id={profileImage?.id}
                status={profileImage?.status}
                meta={profileImage?.meta}
                forceAspectRatioPB={100}
                showPlaceholder
                alt={`${pseudonym}`}
                sizes="(min-width: 45em) 20v, 95vw"
                placeholder="No profile picture uploaded"
              />
            </Box>
          </Grid>
        )}
      </ModulePage>
    </>
  );
};

Index.getLayout = function getLayout(page: ReactElement) {
  return <LayoutOpenAR>{page}</LayoutOpenAR>;
};

export default RestrictPageAccess(Index, "profileRead");

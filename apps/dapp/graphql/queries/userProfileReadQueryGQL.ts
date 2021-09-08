import gql from "graphql-tag";

export const userProfileReadQueryGQL = gql`
  query userProfileRead($ethAddress: String!) {
    userProfileRead(ethAddress: $ethAddress) {
      id
      ethAddress
      pseudonym
      bio
      email
      url
      emailVerified
      profileImage {
        id
        meta
        status
      }
    }
  }
`;

export default userProfileReadQueryGQL;

import gql from "graphql-tag";

export const userProfileReadQueryGQL = gql`
  query userProfileRead($id: Int!) {
    userProfileRead(id: $id) {
      id
      ethAddress
      pseudonym
      bio
      email
      url
      emailVerified
      profileImageId
      profileImage {
        id
        meta
        status
      }
    }
  }
`;

export default userProfileReadQueryGQL;

import gql from "graphql-tag";

export const userProfileReadQueryGQL = gql`
  query userProfileReadById($id: Int!) {
    userProfileReadById(id: $id) {
      id
      ethAddress
      pseudonym
      bio
      email
      url
      acceptedTerms
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

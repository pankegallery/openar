import gql from "graphql-tag";

export const userCreateMutationGQL = gql`
  mutation userCreate($data: UserCreateInput!) {
    userCreate(data: $data) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const userDeleteMutationGQL = gql`
  mutation userDelete($id: Int!) {
    userDelete(id: $id) {
      result
    }
  }
`;

export const userProfilePasswordUpdateMutationGQL = gql`
  mutation userProfilePasswordUpdate(
    $id: Int!
    $password: String!
  ) {
    userProfilePasswordUpdate(id: $id, password: $password) {
      id
      firstName
      lastName
    }
  }
`;

export const userProfileUpdateMutationGQL = gql`
  mutation userProfileUpdate($id: Int!, $data: UserProfileUpdateInput!) {
    userProfileUpdate(id: $id, data: $data) {
      id
      pseudonym
      email
    }
  }
`;

export const userProfileImageUpdateMutationGQL = gql`
  mutation userProfileImageUpdate(
    $id: Int!
    $data: UserProfileImageUpdateInput!
  ) {
    userProfileImageUpdate(id: $id, data: $data) {
      id
      pseudonym
      email
    }
  }
`;

export const userProfileImageDeleteMutationGQL = gql`
  mutation userProfileImageDelete($id: Int!) {
    userProfileImageDelete(id: $id) {
      result
    }
  }
`;

export const userSignupMutationGQL = gql`
  mutation userSignup(
    $firstName: String!
    $lastName: String!
    $email: EmailAddress!
    $password: String!
    $acceptedTerms: Boolean!
  ) {
    userSignup(
      data: {
        firstName: $firstName
        lastName: $lastName
        email: $email
        password: $password
        acceptedTerms: $acceptedTerms
      }
    ) {
      tokens {
        access {
          token
          expires
        }
        refresh {
          expires
        }
      }
    }
  }
`;

export const userUpdateMutationGQL = gql`
  mutation userUpdate($id: Int!, $data: UserUpdateInput!) {
    userUpdate(id: $id, data: $data) {
      result
    }
  }
`;

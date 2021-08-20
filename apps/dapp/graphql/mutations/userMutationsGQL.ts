import gql from "graphql-tag";

export const userCreateMutationGQL = gql`
  mutation userCreate($scope: String!, $data: UserCreateInput!) {
    userCreate(scope: $scope, data: $data) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const userDeleteMutationGQL = gql`
  mutation userDelete($scope: String!, $id: Int!) {
    userDelete(scope: $scope, id: $id) {
      result
    }
  }
`;

export const userProfilePasswordUpdateMutationGQL = gql`
  mutation userProfilePasswordUpdate(
    $scope: String!
    $id: Int!
    $password: String!
  ) {
    userProfilePasswordUpdate(scope: $scope, id: $id, password: $password) {
      id
      firstName
      lastName
    }
  }
`;

export const userProfileUpdateMutationGQL = gql`
  mutation userProfileUpdate(
    $scope: String!
    $id: Int!
    $data: UserProfileUpdateInput!
  ) {
    userProfileUpdate(scope: $scope, id: $id, data: $data) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const userProfileImageUpdateMutationGQL = gql`
  mutation userProfileImageUpdate(
    $scope: String!
    $id: Int!
    $data: UserProfileImageUpdateInput!
  ) {
    userProfileImageUpdate(scope: $scope, id: $id, data: $data) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const userProfileImageDeleteMutationGQL = gql`
  mutation userProfileImageDelete($scope: String!, $id: Int!) {
    userProfileImageDelete(scope: $scope, id: $id) {
      result
    }
  }
`;

export const userSignupMutationGQL = gql`
  mutation userSignup(
    $scope: String!
    $firstName: String!
    $lastName: String!
    $email: EmailAddress!
    $password: String!
    $acceptedTerms: Boolean!
  ) {
    userSignup(
      scope: $scope
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
  mutation userUpdate($scope: String!, $id: Int!, $data: UserUpdateInput!) {
    userUpdate(scope: $scope, id: $id, data: $data) {
      result
    }
  }
`;

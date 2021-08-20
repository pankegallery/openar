import gql from "graphql-tag";

export const authPasswordResetMutationGQL = gql`
  mutation authPasswordReset($password: String!, $token: String!) {
    authPasswordReset(password: $password, token: $token) {
      result
    }
  }
`;

export const authPasswordRequestMutationGQL = gql`
  mutation authPasswordRequest($scope: String!, $email: EmailAddress!) {
    authPasswordRequest(scope: $scope, email: $email) {
      result
    }
  }
`;

export const authLogoutMutationGQL = gql`
  mutation authLogout($userId: Int!) {
    authLogout(userId: $userId) {
      result
    }
  }
`;

export const authLoginMutationGQL = gql`
  mutation authLogin(
    $scope: String!
    $email: EmailAddress!
    $password: String!
  ) {
    authLogin(scope: $scope, email: $email, password: $password) {
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

export const authRefreshMutationGQL = gql`
  mutation authRefresh($scope: String!) {
    authRefresh(scope: $scope) {
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

export const authRequestEmailVerificationEmailMutationGQL = gql`
  mutation authRequestEmailVerificationEmail($scope: String!, $userId: Int!) {
    authRequestEmailVerificationEmail(scope: $scope, userId: $userId) {
      result
    }
  }
`;

export const authVerifyEmailMutationGQL = gql`
  mutation authVerifyEmail($token: String!) {
    authVerifyEmail(token: $token) {
      result
    }
  }
`;

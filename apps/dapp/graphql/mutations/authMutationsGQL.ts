import gql from "graphql-tag";

export const authPasswordResetMutationGQL = gql`
  mutation authPasswordReset($password: String!, $token: String!) {
    authPasswordReset(password: $password, token: $token) {
      result
    }
  }
`;

export const authPasswordRequestMutationGQL = gql`
  mutation authPasswordRequest($email: EmailAddress!) {
    authPasswordRequest(email: $email) {
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

export const authRegisterByEmailMutationGQL = gql`
  mutation authRegisterByEmail(
    $email: String!,
    $password: String!
  ) {
    authRegisterByEmail(email: $email, password: $password) {
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

export const authLoginByEmailMutationGQL = gql`
  mutation authLoginByEmail(    
    $email: String!,
    $password: String!
  ) {
    authLoginByEmail(email: $email, password: $password) {
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

export const authChangePasswordMutationGQL = gql`
  mutation authChangePassword(
    $userId: Int!,
    $currentPassword: String!,
    $newPassword: String!
  ) {
    authChangePassword(userId: $userId, currentPassword: $currentPassword, newPassword: $newPassword) {
      result    
    }
  }
`;

export const authPreLoginMutationGQL = gql`
  mutation authPreLogin(
    $ethAddress: String!
  ) {
    authPreLogin(ethAddress: $ethAddress) {
      tokens {
        access {
          token
          expires
        }
        refresh {
          expires
        }
        sign {
          token
          expires
        }
      }
    }
  }
`;

export const authLoginMutationGQL = gql`
  mutation authLogin(
    $ethAddress: String!
    $signedMessage: String!    
  ) {
    authLogin(ethAddress: $ethAddress, signedMessage: $signedMessage) {
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
  mutation authRefresh {
    authRefresh {
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
  mutation authRequestEmailVerificationEmail($userId: Int!) {
    authRequestEmailVerificationEmail(userId: $userId) {
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

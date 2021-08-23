import { authLoginMutationGQL } from "~/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useAuthentication } from "~/hooks";
import { authentication } from "~/services";

export const useAuthLoginMutation = () => {
  const [, { login, preLoginLogout }] = useAuthentication();

  const [mutation, mutationResults] = useMutation(authLoginMutationGQL, {
    onCompleted: (data) => {
      const tokens = data?.authLogin?.tokens;

      if (tokens && tokens?.access && tokens?.refresh) {
        const payload = authentication.getTokenPayload(
          data.authLogin.tokens.access
        );

        if (payload) {
          console.log("login 2(payload.user)", payload.user);
          authentication.setAuthToken(tokens.access);
          authentication.setRefreshCookie(tokens.refresh);
          login(payload.user);
        }
      }
    },
  });

  const execute = async (ethAddress: string, signedMessage: string) => {
    preLoginLogout();
    return mutation({
      variables: {
        ethAddress,
        signedMessage,
      },
    });
  };
  return [execute, mutationResults] as const;
};

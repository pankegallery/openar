import { authLoginMutationGQL } from "~/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useAuthentication } from "~/hooks";
import { authentication } from "~/services";

export const useAuthLoginMutation = () => {
  const [, { login, preLoginLogout }] = useAuthentication();

  const [mutation, mutationResults] = useMutation(authLoginMutationGQL, {
    onCompleted: (data) => {
      console.log("123");
      console.log(data);
      const tokens = data?.authLogin?.tokens;

      if (tokens && tokens?.access && tokens?.refresh) {
        console.log("222")
        const payload = authentication.getTokenPayload(
          data.authLogin.tokens.access
        );

        if (payload) {
          console.log("333")
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

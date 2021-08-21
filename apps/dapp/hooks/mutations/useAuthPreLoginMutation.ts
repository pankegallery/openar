import { authPreLoginMutationGQL } from "~/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useAuthentication } from "~/hooks";
import { authentication } from "~/services";

export const useAuthPreLoginMutation = () => {
  const [, { login, preLoginLogout }] = useAuthentication();

  const [mutation, mutationResults] = useMutation( authPreLoginMutationGQL, {
    onCompleted: (data) => {
      console.log("012312");
      console.log(data)
      const tokens = data?.authPreLogin?.tokens;

      if (tokens && tokens?.access && tokens?.refresh) {
        console.log("023432")
        const payload = authentication.getTokenPayload(tokens.access);

        if (payload) {
          console.log("0333")
          authentication.setAuthToken(tokens.access);
          authentication.setRefreshCookie(tokens.refresh);
          login(payload.user);
        }
      }
    },
  });

  const execute = async (ethAddress: string) => {
    preLoginLogout();
    return mutation({
      variables: {
        ethAddress,
      },
    });
  };
  return [execute, mutationResults] as const;
};

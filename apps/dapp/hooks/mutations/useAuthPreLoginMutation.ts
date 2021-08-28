import { authPreLoginMutationGQL } from "~/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useAuthentication } from "~/hooks";
import { authentication } from "~/services";

export const useAuthPreLoginMutation = () => {
  const [, { login, preLoginLogout }] = useAuthentication();

  const [mutation, mutationResults] = useMutation( authPreLoginMutationGQL, {
    onCompleted: (data) => {
      
      const tokens = data?.authPreLogin?.tokens;

      if (tokens && tokens?.access && tokens?.refresh) {
        const payload = authentication.getTokenPayload(tokens.access);

        if (payload) {

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

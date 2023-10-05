import { authLoginByEmailMutationGQL } from "~/graphql/mutations";
import { useMutation } from "@apollo/client";
import { useAuthentication } from "~/hooks";
import { authentication } from "~/services";

export const useAuthLoginByEmailMutation = () => {
  const [, { login, preLoginLogout }] = useAuthentication();

  const [mutation, mutationResults] = useMutation(authLoginByEmailMutationGQL, {
    onCompleted: (data) => {
      const tokens = data?.authLoginByEmail?.tokens;

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

  const execute = async (email: string, password: string) => {
    preLoginLogout();
    return mutation({
      variables: {
        email: email.toLowerCase(),
        password: password
      },
    });
  };
  return [execute, mutationResults] as const;
};

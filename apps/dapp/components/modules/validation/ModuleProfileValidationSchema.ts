import { string, object, boolean } from "yup";

export const UserProfileUpdateValidationSchema = object().shape({
  pseudonym: string().required(),
  email: string().email().required(),
  url: string().url().nullable(),
  bio: string().nullable(),
  acceptedTerms: boolean()
    .required("The terms and conditions must be accepted.")
    .oneOf([true], "The terms and conditions must be accepted."),
});

export default UserProfileUpdateValidationSchema;

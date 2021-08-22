import { string, object } from "yup";

export const UserProfileUpdateValidationSchema = object().shape({
  pseudonym: string().nullable(),
  email: string().email().required(),
  url: string().url().nullable(),
  bio: string().nullable(),
  
});

export default UserProfileUpdateValidationSchema;

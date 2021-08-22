import { string, object } from "yup";

export const UserProfileUpdateValidationSchema = object().shape({
  pseudonym: string(),
  email: string().email().required(),
  url: string().url(),
  bio: string(),
  
});

export default UserProfileUpdateValidationSchema;

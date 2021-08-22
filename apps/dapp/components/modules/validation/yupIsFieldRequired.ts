export const yupIsFieldRequired = (key: string, yupValidationSchema: any) => {
  return yupValidationSchema?.fields[key]?.exclusiveTests?.required === true;
}
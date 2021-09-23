export const trimStringToLength = (str: string, length: number) =>
    str.length > length ? `${str.substr(0, length - 3)}...` : str;
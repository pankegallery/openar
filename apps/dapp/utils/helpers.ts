export const trimStringToLength = (str: string, length: number) =>
    str.length > length ? `${str.substr(0, length - 3)}...` : str;

export const getArtistName = (pseudonym: string, ethAddress: string) => {
    if (pseudonym && typeof pseudonym === "string" && pseudonym.trim() !== "")
        return pseudonym;
    return ethAddress;
}
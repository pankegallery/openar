export const htmlToString = (html: string): string => {
  try {
    const dom = new DOMParser().parseFromString(html ?? "", "text/html");
    return dom?.body?.textContent ?? null;
  } catch(err) {
    return null;
  }
}
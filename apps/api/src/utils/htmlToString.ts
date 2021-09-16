import { JSDOM } from "jsdom";

export const htmlToString = (html: string): string | null => {
  try {
    const dom = new JSDOM(html ?? "");
    return dom?.window?.document?.querySelector("body")?.textContent ?? null;
  } catch(err) {
    return null;
  }
}
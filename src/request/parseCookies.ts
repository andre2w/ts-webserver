import { InvalidRequestError } from "../http";
import { MapBuilder } from "../utils/MapBuilder";

export function parseCookies(requestHeaders: string[]): Map<string, string> {
  const cookieHeader = requestHeaders
    .find((header) => header.startsWith("Cookie"))
    ?.substr(8);

  if (cookieHeader === undefined) {
    return new Map();
  }

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.split("="))
    .map((cookie) => extractCookie(cookie))
    .reduce(
      (cookies, cookie) => cookies.add(cookie.key, cookie.value),
      new MapBuilder<string, string>()
    )
    .build();
}

function extractCookie(cookie: string[]): { key: string; value: string } {
  const key = cookie[0];
  const value = cookie[1];

  if (key === undefined || value === undefined) {
    throw new InvalidRequestError();
  }
  return { key: key.trim(), value: value.trim() };
}

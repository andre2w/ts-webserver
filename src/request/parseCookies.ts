import { MapBuilder } from "../utils/MapBuilder";

export function parseCookies(requestHeaders: string[]): Map<string, string> {
  let cookieHeader = requestHeaders
    .find((header) => header.startsWith("Cookie"))
    ?.substr(8);

  if (cookieHeader === undefined) {
    return new Map();
  }

  return cookieHeader
    .split(";")
    .map((cookie) => cookie.split("="))
    .map((cookie) => {
      return { key: cookie[0]!.trim(), value: cookie[1]!.trim() };
    })
    .reduce(
      (cookies, cookie) => cookies.add(cookie.key, cookie.value),
      new MapBuilder<string, string>()
    )
    .build();
}

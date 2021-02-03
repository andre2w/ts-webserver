import { MapBuilder } from "../MapBuilder";

export function parseCookies(requestHeaders: string[]): Map<string, string> {
  let cookieHeader = requestHeaders
    .find((header) => header.startsWith("Cookie"))
    ?.substr(8);

  if (cookieHeader === undefined) {
    return new Map();
  }

  return cookieHeader
    .split(";")
    .map((cookie) => {
      const splitCookie = cookie.split("=");
      return { key: splitCookie[0]!.trim(), value: splitCookie[1]!.trim() };
    })
    .reduce(
      (cookies, cookie) => cookies.add(cookie.key, cookie.value),
      new MapBuilder<string, string>()
    )
    .build();
}

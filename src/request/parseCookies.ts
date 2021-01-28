import { Cookies } from "../HttpRequest";

export function parseCookies(requestHeaders: string[]): Cookies {
  let cookieHeader = requestHeaders
    .find((header) => header.startsWith("Cookie"))
    ?.substr(8);

  let cookies: Cookies = {};
  if (cookieHeader === undefined) {
    return cookies;
  }

  cookieHeader
    .split(";")
    .map((cookie) => {
      const splitCookie = cookie.split("=");
      return { key: splitCookie[0]!, value: splitCookie[1]! };
    })
    .forEach((cookie) => (cookies[cookie.key.trim()] = cookie.value.trim()));

  return cookies;
}

import { Cookie, HttpResponse } from "../http";
import StringJoiner from "../utils/StringJoiner";

const attributeNames = new Map([
  ["expires", "Expires"],
  ["maxAge", "Max-Age"],
  ["domain", "Domain"],
  ["path", "Path"],
  ["secure", "Secure"],
  ["httpOnly", "HttpOnly"],
  ["sameSite", "SameSite"],
]);

export function buildCookies(httpResponse: HttpResponse): string[] {
  const result: string[] = [];
  httpResponse.cookies.forEach((attributtes, name) =>
    result.push(buildCookie(name, attributtes))
  );
  return result;
}

function buildCookie(name: string, attributes: Cookie): string {
  const cookieLine = new StringJoiner("; ");
  cookieLine.add(`Set-Cookie: ${name}=${attributes.value}`);

  for (const [attr, value] of Object.entries(attributes)) {
    const attributeName = attributeNames.get(attr);

    if (attributeName === undefined) {
      continue;
    }

    if (attr === "secure" || attr === "httpOnly") {
      if (value === true) {
        cookieLine.add(attributeName);
      }
    } else {
      const cookieValue = value instanceof Date ? value.toUTCString() : value;
      cookieLine.add(`${attributeName}=${cookieValue}`);
    }
  }
  return cookieLine.toString();
}

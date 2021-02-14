import { Cookie, HttpResponse } from "../http";
import StringJoiner from "../utils/StringJoiner";
import { codeToMessage } from "./codeToMessage";

const lineBreak = "\r\n";

export function buildResponse(httpResponse: HttpResponse): string {
  const response = new StringJoiner(lineBreak, { suffix: lineBreak });
  response.add(
    `HTTP/1.1 ${httpResponse.code} ${codeToMessage(httpResponse.code)}`
  );
  response.add("Server: ts-webserver");
  response.add(`Content-Length: ${httpResponse.bodyLength()}`);

  if (httpResponse.headers.size > 0) {
    buildHeaders(httpResponse).forEach((header) => response.add(header));
  }

  if (httpResponse.cookies.size > 0) {
    buildCookies(httpResponse).forEach((cookie) => response.add(cookie));
  }

  // This line is to separate the headers and body
  response.add("");

  if (httpResponse.body !== undefined) {
    response.add(httpResponse.body);
  }

  return response.toString();
}

function buildHeaders(httpResponse: HttpResponse): string[] {
  const result = [];
  for (const header of httpResponse.headers.entries()) {
    result.push(`${header[0]}: ${header[1]}`);
  }
  return result;
}

const attributeNames = new Map([
  ["expires", "Expires"],
  ["maxAge", "Max-Age"],
  ["domain", "Domain"],
  ["path", "Path"],
  ["secure", "Secure"],
  ["httpOnly", "HttpOnly"],
  ["sameSite", "SameSite"],
]);

function buildCookies(httpResponse: HttpResponse): string[] {
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

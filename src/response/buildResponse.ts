import { Cookie, HttpResponse } from "../Http";

const lineBreak = "\r\n";

export function buildResponse(httpResponse: HttpResponse): string {
  let responseLines: string[] = [`HTTP/1.1 ${httpResponse.code} OK`];
  responseLines.push("Server: ts-webserver");
  responseLines.push(`Content-Length: ${httpResponse.bodyLength()}`);

  buildHeaders(httpResponse, responseLines);
  buildCookies(httpResponse, responseLines);

  let response = `${responseLines.join(lineBreak)}${lineBreak}`;
  response += buildBody(httpResponse);
  response += `${lineBreak}`;
  return response;
}

function buildBody(httpResponse: HttpResponse) {
  if (httpResponse.hasBody()) {
    return `${lineBreak}${httpResponse.body}`;
  }
  return "";
}

function buildHeaders(httpResponse: HttpResponse, responseLines: string[]) {
  for (let header of httpResponse.headers.entries()) {
    responseLines.push(`${header[0]}: ${header[1]}`);
  }
}

const attributeNames = new Map([
  ["expires", "Expires"],
  ["maxAge", "Max-Age"],
  ["domain", "Domain"],
  ["path", "Path"],
  ["secure", "Secure"],
]);

function buildCookies(httpResponse: HttpResponse, responseLines: string[]) {
  for (let cookie of httpResponse.cookies.entries()) {
    let cookieLine = buildCookie(cookie);
    responseLines.push(cookieLine);
  }
}

function buildCookie(cookie: [string, Cookie]) {
  const cookieAttributes = cookie[1];
  const cookieName = cookie[0];

  let cookieLine = `Set-Cookie: ${cookieName}=${cookieAttributes.value}`;

  for (const [attr, value] of Object.entries(cookieAttributes)) {
    if (attributeNames.has(attr)) {
      if (attr === "secure") {
        if (value === true) {
          cookieLine += "; Secure";
        }
      } else {
        const cookieValue = value instanceof Date ? value.toUTCString() : value;
        cookieLine += `; ${attributeNames.get(attr)}=${cookieValue}`;
      }
    }
  }
  return cookieLine;
}

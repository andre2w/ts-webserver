import { HttpResponse } from "../Http";

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

function buildCookies(httpResponse: HttpResponse, responseLines: string[]) {
  for (let cookie of httpResponse.cookies.entries()) {
    const cookieAttributes = cookie[1];
    const cookieName = cookie[0];

    let cookieLine = `Set-Cookie: ${cookieName}=${cookieAttributes.value}`;

    if (cookieAttributes.expires !== undefined) {
      cookieLine += `; Expires=${cookieAttributes.expires.toUTCString()}`;
    }

    if (cookieAttributes.maxAge !== undefined) {
      cookieLine += `; Max-Age=${cookieAttributes.maxAge}`;
    }

    responseLines.push(cookieLine);
  }
}

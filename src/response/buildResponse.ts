import { HttpResponse } from "../http";
import StringJoiner from "../utils/StringJoiner";
import { buildCookies } from "./buildCookies";
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

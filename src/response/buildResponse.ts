import { Headers } from "../HttpRequest";

export interface HttpResponse {
  code: number;
  body: string;
  headers: Headers;
}

export function buildResponse(httpResponse: HttpResponse): string {
  let response: string[] = [`HTTP/1.1 ${httpResponse.code} OK`];
  response.push("Server: ts-webserver");
  response.push(`Content-Length: ${httpResponse.body.length}`);

  Object.keys(httpResponse.headers)
    .map((header) => {
      return { key: header, value: httpResponse.headers[header] };
    })
    .forEach((header) => response.push(`${header.key}: ${header.value}`));

  return `${response.join(`\r\n`)}\r\n\r\n${httpResponse.body}\r\n`;
}

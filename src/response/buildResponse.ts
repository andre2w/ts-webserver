import { Headers } from "../HttpRequest";

export interface HttpResponse {
  code: number;
  body: string;
  headers: Headers;
}

export function buildResponse(httpResponse: HttpResponse): string {
  let responseLines: string[] = [`HTTP/1.1 ${httpResponse.code} OK`];
  responseLines.push("Server: ts-webserver");
  responseLines.push(`Content-Length: ${httpResponse.body.length}`);

  Object.keys(httpResponse.headers)
    .map((header) => {
      return { key: header, value: httpResponse.headers[header] };
    })
    .forEach((header) => responseLines.push(`${header.key}: ${header.value}`));

  let response = `${responseLines.join(`\r\n`)}\r\n`;
  if (httpResponse.body !== "") {
    response += `\r\n${httpResponse.body}`;
  }
  response += `\r\n`;
  return response;
}

import { HttpResponse } from "../Http";

const lineBreak = "\r\n";

export function buildResponse(httpResponse: HttpResponse): string {
  let responseLines: string[] = [`HTTP/1.1 ${httpResponse.code} OK`];
  responseLines.push("Server: ts-webserver");
  responseLines.push(`Content-Length: ${httpResponse.bodyLength()}`);

  for (let header of httpResponse.headers.entries()) {
    responseLines.push(`${header[0]}: ${header[1]}`);
  }

  let response = `${responseLines.join(lineBreak)}${lineBreak}`;
  if (httpResponse.hasBody()) {
    response += `${lineBreak}${httpResponse.body}`;
  }
  response += `${lineBreak}`;
  return response;
}

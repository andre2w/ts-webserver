import {
  HttpRequestClass,
  HttpRequestLine,
  InvalidRequestError,
} from "../Http";
import { parseCookies } from "./parseCookies";
import { parseHeaders } from "./parseHeaders";

export function parseRequest(request: string): HttpRequestClass {
  const splitRequest = request.split("\r\n")!;

  let httpInfo = splitRequest.shift()!;
  let httpRequestLine = parseRequestLine(httpInfo);
  let cookies = parseCookies(splitRequest);
  let headers = parseHeaders(splitRequest);

  const httpRequest = new HttpRequestClass(httpRequestLine);

  Object.entries(cookies).forEach((cookie) =>
    httpRequest.addCookie(cookie[0], cookie[1])
  );
  Object.entries(headers).forEach((header) =>
    httpRequest.addHeader(header[0], header[1])
  );

  return httpRequest;
}

function parseRequestLine(line: string): HttpRequestLine {
  let [method, uri, version] = line.split(" ");

  if (method === undefined || uri === undefined || version === undefined) {
    throw new InvalidRequestError();
  }

  return {
    method,
    uri,
    version,
  };
}

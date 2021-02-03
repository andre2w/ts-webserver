import { HttpRequest, HttpRequestLine, InvalidRequestError } from "../Http";
import { parseCookies } from "./parseCookies";
import { parseHeaders } from "./parseHeaders";

export function parseRequest(request: string): HttpRequest {
  const splitRequest = request.split("\r\n")!;

  let httpInfo = splitRequest.shift()!;
  let httpRequestLine = parseRequestLine(httpInfo);
  let cookies = parseCookies(splitRequest);
  let headers = parseHeaders(splitRequest);

  return new HttpRequest(httpRequestLine, headers, cookies);
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

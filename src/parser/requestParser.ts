import { HttpRequest, HttpRequestLine } from "../HttpRequest";
import { parseCookies } from "./parseCookies";
import { parseHeaders } from "./parseHeaders";

export function parseRequest(request: string): HttpRequest {
  const splitRequest = request.split("\r\n")!;

  let httpInfo = splitRequest.shift()!;
  let httpRequestLine = parseRequestLine(httpInfo);
  let cookies = parseCookies(splitRequest);
  let headers = parseHeaders(splitRequest);

  return {
    ...httpRequestLine,
    headers: headers,
    cookies: cookies,
  };
}

function parseRequestLine(line: string): HttpRequestLine {
  let [method, url, version] = line.split(" ");
  let result = {
    method: "",
    uri: "",
    version: "",
  };

  if (typeof method === "string") {
    result.method = method;
  }

  if (typeof url === "string") {
    result.uri = url;
  }

  if (typeof version === "string") {
    result.version = version;
  }

  return result;
}

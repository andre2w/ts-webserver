import { HttpRequest, InvalidRequestError } from "../Http";
import { parseCookies } from "./parseCookies";
import { parseHeaders } from "./parseHeaders";

export function parseRequest(request: string): HttpRequest {
  const splitRequest = request.split("\r\n")!;

  let httpInfo = splitRequest.shift()!;
  let httpRequestLine = parseRequestLine(httpInfo);
  let cookies = parseCookies(splitRequest);
  let headers = parseHeaders(splitRequest);

  return new HttpRequest(
    httpRequestLine,
    headers,
    cookies,
    httpRequestLine.queryParameters
  );
}

function parseRequestLine(line: string) {
  let [method, uri, version] = line.split(" ");

  if (method === undefined || uri === undefined || version === undefined) {
    throw new InvalidRequestError();
  }

  let paramDelimiter = uri.indexOf("?");
  let queryParameters = new Map<string, string>();

  if (paramDelimiter >= 0) {
    let params = uri.substr(paramDelimiter + 1);
    uri = uri.substring(0, paramDelimiter);

    params
      .split("&")
      .map((param) => param.split("="))
      .forEach((param) => {
        if (param[0] === undefined || param[1] === undefined) {
          throw new InvalidRequestError();
        }
        queryParameters.set(param[0], param[1]);
      });
  }

  return {
    method,
    uri,
    version,
    queryParameters,
  };
}

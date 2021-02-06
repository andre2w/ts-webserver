import { HttpRequest, InvalidRequestError } from "../Http";
import { parseCookies } from "./parseCookies";
import { parseHeaders } from "./parseHeaders";

export function parseRequest(request: string): HttpRequest {
  const splitRequest = request.split("\r\n\r\n")!;
  const head = splitRequest[0]!.split("\r\n");
  const body = splitRequest[1] === "" ? undefined : splitRequest[1]?.trim();

  let httpInfo = head.shift()!;
  let httpRequestLine = parseRequestLine(httpInfo);
  let cookies = parseCookies(head);
  let headers = parseHeaders(head);

  return new HttpRequest(
    httpRequestLine,
    body,
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

  let queryParameters;
  ({ queryParameters, uri } = parseParameters(uri));

  return {
    method,
    uri,
    version,
    queryParameters,
  };
}

function parseParameters(uri: string) {
  let paramDelimiter = uri.indexOf("?");
  let queryParameters = new Map<string, string>();

  if (paramDelimiter < 0) {
    return { queryParameters: new Map(), uri };
  }

  let params = uri.substr(paramDelimiter + 1);
  uri = uri.substring(0, paramDelimiter);

  params
    .split("&")
    .map((param) => param.split("="))
    .forEach((param) => {
      if (param[0] === undefined || param[1] === undefined) {
        throw new InvalidRequestError();
      }
      queryParameters.set(param[0], decodeURIComponent(param[1]));
    });

  return { queryParameters, uri };
}

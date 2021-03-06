import { HttpRequest, InvalidRequestError } from "../http";
import { parseCookies } from "./parseCookies";
import { parseHeaders } from "./parseHeaders";
import { MapBuilder } from "../utils/MapBuilder";

const lineBreak = "\r\n";

export function parseRequest(request: string): HttpRequest {
  // Split the headers from the body
  const splitRequest = request.split(`${lineBreak}${lineBreak}`);
  const head = splitRequest[0]?.split(lineBreak) ?? [];
  const body = splitRequest[1] === "" ? undefined : splitRequest[1]?.trim();
  const httpInfo = head.shift();

  if (httpInfo === undefined) {
    throw new InvalidRequestError();
  }

  const httpRequestLine = parseRequestLine(httpInfo);
  const cookies = parseCookies(head);
  const headers = parseHeaders(head);

  let formData: Map<string, string> | undefined;
  for (const header of headers) {
    if (isFormUrlEncoded(header) && body !== undefined) {
      formData = parseQuery(body);
    }
  }

  return new HttpRequest(
    httpRequestLine,
    body,
    headers,
    cookies,
    httpRequestLine.params,
    formData
  );
}

function isFormUrlEncoded(header: [string, string]): boolean {
  if (header[0].toLowerCase() !== "content-type") {
    return false;
  }
  return header[1].toLowerCase() === "application/x-www-form-urlencoded";
}

function parseRequestLine(line: string) {
  const [method, uri, version] = line.split(" ");

  if (method === undefined || uri === undefined || version === undefined) {
    throw new InvalidRequestError();
  }

  const parsedURI = parseParameters(uri);

  return {
    method,
    version,
    uri: parsedURI.uri,
    params: parsedURI.params,
  };
}

function parseParameters(
  uri: string
): { uri: string; params: Map<string, string> } {
  const paramDelimiter = uri.indexOf("?");

  if (paramDelimiter < 0) {
    return { uri, params: new Map() };
  }

  const params = uri.substr(paramDelimiter + 1);
  uri = uri.substring(0, paramDelimiter);

  const queryParameters = parseQuery(params);

  return {
    uri,
    params: queryParameters,
  };
}

function parseQuery(params: string) {
  return params
    .split("&")
    .map((param) => param.split("="))
    .map((param) => getParam(param))
    .reduce(
      (builder, param) =>
        builder.add(param.key, decodeURIComponent(param.value)),
      new MapBuilder<string, string>()
    )
    .build();
}

function getParam(param: string[]): { key: string; value: string } {
  const key = param[0];
  const value = param[1];
  if (key === undefined || value === undefined) {
    throw new InvalidRequestError();
  }
  return { key, value };
}

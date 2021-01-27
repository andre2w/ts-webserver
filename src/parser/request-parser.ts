export interface Headers {
  [name: string]: string;
}

interface HttpRequestLine {
  method: string;
  uri: string;
  version: string;
}

export type HttpRequest = HttpRequestLine & {
  headers: Headers;
};

export function parseRequest(request: string): HttpRequest {
  const requestLines = request.split("\r\n")!;

  let httpInfo = requestLines.shift()!;
  let httpRequestLine = parseRequestLine(httpInfo);
  let headers = parseHeaders(requestLines);
  let httpRequest = {
    ...httpRequestLine,
    headers: headers,
  };

  return httpRequest;
}

function parseHeaders(requestHeaders: string[]): Headers {
  const parseHeader = (header: string): { key: string; value: string } => {
    const delimiterIndex = header.indexOf(":");
    const key = header.substring(0, delimiterIndex);
    const value = header.substring(delimiterIndex + 1);
    return { key: key, value: value.trim() };
  };

  let headers: Headers = {};
  requestHeaders
    .map(parseHeader)
    .forEach((header) => (headers[header.key] = header.value));
  return headers;
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

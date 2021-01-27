export interface Headers {
  [name: string]: string;
}

export interface Cookies {
  [name: string]: string;
}

interface HttpRequestLine {
  method: string;
  uri: string;
  version: string;
}

export type HttpRequest = HttpRequestLine & {
  headers: Headers;
  cookies: Cookies;
};

export function parseRequest(request: string): HttpRequest {
  const splitRequest = request.split("\r\n")!;

  let httpInfo = splitRequest.shift()!;
  let httpRequestLine = parseRequestLine(httpInfo);

  let cookies: Cookies = {};
  for (let i = 0; i < splitRequest.length; i++) {
    if (splitRequest[i]?.startsWith("Cookie")) {
      let cookiesLine = splitRequest[i]?.substr(8);

      if (cookiesLine !== undefined) {
        cookiesLine
          .split(";")
          .map((cookie) => {
            const splitCookie = cookie.split("=");
            return { key: splitCookie[0]!, value: splitCookie[1]! };
          })
          .forEach(
            (cookie) => (cookies[cookie.key.trim()] = cookie.value.trim())
          );
      }

      splitRequest.splice(i, 1);
      break;
    }
  }

  splitRequest.find((header) => header.startsWith("Cookie"));

  let headers = parseHeaders(splitRequest);

  return {
    ...httpRequestLine,
    headers: headers,
    cookies: cookies,
  };
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

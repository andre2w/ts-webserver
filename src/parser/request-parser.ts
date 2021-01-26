export interface Headers {
  [name: string]: string
}

export interface HttpRequest {
  method: string,
  url: string,
  version: string,
  host: string,
  userAgent?: string,
  headers: Headers
}

export function parseRequest(request: string): HttpRequest {
  const requestLines = request.split('\r\n')!;
  let httpRequest: HttpRequest = {
    method: "",
    url: "",
    version: "",
    host: "",
    userAgent: "",
    headers: {}
  };

  let httpInfo = requestLines.shift()!;
  let [method, url, version] = httpInfo.split(' ');
  if (typeof method === 'string') {
    httpRequest.method = method;
  }

  if (typeof url === 'string') {
    httpRequest.url = url;
  }

  if (typeof version === 'string') {
    httpRequest.version = version;
  }

  for (let requestLine of requestLines) {
    let delimiterIndex = requestLine.indexOf(':');
    let key = requestLine.substring(0, delimiterIndex);
    let value = requestLine.substring(delimiterIndex + 1);

    if (typeof value === 'string') {
      if (key === 'Host') {
        httpRequest.host = value.trim();
      } else if (key === 'User-Agent') {
        httpRequest.userAgent = value.trim();
      } else {
        if (typeof key === 'string') {
          httpRequest.headers[key] = value.trim();
        }
      }
    }

  }
  return httpRequest;
}


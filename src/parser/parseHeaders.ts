import { Headers } from "../HttpRequest";

export function parseHeaders(requestHeaders: string[]): Headers {
  const parseHeader = (header: string): { key: string; value: string } => {
    const delimiterIndex = header.indexOf(":");
    const key = header.substring(0, delimiterIndex);
    const value = header.substring(delimiterIndex + 1);
    return { key: key, value: value.trim() };
  };

  let headers: Headers = {};
  requestHeaders
    .filter((header) => !header.startsWith("Cookie"))
    .map(parseHeader)
    .forEach((header) => (headers[header.key] = header.value));
  return headers;
}

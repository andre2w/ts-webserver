import { Headers } from "../Http";

interface Header {
  key: string;
  value: string;
}

export function parseHeaders(requestHeaders: string[]): Headers {
  let headers: Headers = {};
  requestHeaders
    .filter(filterHeaders)
    .map(parseHeader)
    .forEach((header) => (headers[header.key] = header.value));
  return headers;
}

const parseHeader: (header: string) => Header = (header) => {
  const delimiterIndex = header.indexOf(":");
  const key = header.substring(0, delimiterIndex);
  const value = header.substring(delimiterIndex + 1);
  return { key: key, value: value.trim() };
};

const filterHeaders: (header: string) => boolean = (header) => {
  return !header.startsWith("Cookie") && header.trim() !== "";
};

import { InvalidRequestError } from "../http";
import { MapBuilder } from "../utils/MapBuilder";

interface Header {
  key: string;
  value: string;
}

export function parseHeaders(requestHeaders: string[]): Map<string, string> {
  return requestHeaders
    .filter(filterHeaders)
    .map(parseHeader)
    .reduce(
      (headers, header) => headers.add(header.key, header.value),
      new MapBuilder<string, string>()
    )
    .build();
}

function parseHeader(header: string): Header {
  const delimiterIndex = header.indexOf(":");

  if (delimiterIndex <= 0) {
    throw new InvalidRequestError();
  }

  const key = header.substring(0, delimiterIndex);
  const value = header.substring(delimiterIndex + 1);
  return { key: key, value: value.trim() };
}

function filterHeaders(header: string): boolean {
  return !header.startsWith("Cookie") && header.trim() !== "";
}

import { InvalidRequestError } from "../Http";
import { MapBuilder } from "../MapBuilder";

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

const parseHeader: (header: string) => Header = (header) => {
  const delimiterIndex = header.indexOf(":");

  if (delimiterIndex <= 0) {
    throw new InvalidRequestError();
  }

  const key = header.substring(0, delimiterIndex);
  const value = header.substring(delimiterIndex + 1);
  return { key: key, value: value.trim() };
};

const filterHeaders: (header: string) => boolean = (header) => {
  return !header.startsWith("Cookie") && header.trim() !== "";
};

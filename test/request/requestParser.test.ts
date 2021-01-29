import { parseRequest } from "../../src/request/requestParser";
import { HttpRequest, InvalidRequestError } from "../../src/Http";

describe("Parsing an http GET request", () => {
  test("the parsed request should contain request line and headers", () => {
    const request =
      `GET / HTTP/1.1\r\n` +
      `Host: localhost:8088\r\n` +
      `User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0\r\n` +
      `Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8\r\n` +
      `Accept-Language: en-GB,en;q=0.5\r\n` +
      `Accept-Encoding: gzip, deflate\r\n` +
      `Connection: keep-alive\r\n` +
      `Cookie: aCookie=withValue; otherCookie=withAnotherValue\r\n` +
      `Upgrade-Insecure-Requests: 1\r\n`;

    let httpRequest: HttpRequest = parseRequest(request);
    const expectRequest = {
      method: "GET",
      uri: "/",
      version: "HTTP/1.1",
      headers: {
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-GB,en;q=0.5",
        "Accept-Encoding": "gzip, deflate",
        Connection: "keep-alive",
        "Upgrade-Insecure-Requests": "1",
        Host: "localhost:8088",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
      },
      cookies: {
        aCookie: "withValue",
        otherCookie: "withAnotherValue",
      },
    };
    expect(httpRequest).toStrictEqual(expectRequest);
  });

  test.each(["GET HTTP/1.1", "GET", ""])(
    "Fail parsing when request has missing information",
    (line) => {
      const request =
        `${line}\r\n` +
        `Host: localhost:8088\r\n` +
        `Upgrade-Insecure-Requests: 1\r\n`;

      expect(() => parseRequest(request)).toThrowError(InvalidRequestError);
    }
  );

  test("should allow requests with more information than needed", () => {
    const request =
      `GET / HTTP/1.1 otherInformation\r\n` +
      `Host: localhost:8088\r\n` +
      `Upgrade-Insecure-Requests: 1\r\n`;

    const expectedRequest = {
      method: "GET",
      uri: "/",
      version: "HTTP/1.1",
      headers: {
        "Upgrade-Insecure-Requests": "1",
        Host: "localhost:8088",
      },
      cookies: {},
    };

    expect(parseRequest(request)).toStrictEqual(expectedRequest);
  });

  test.each(["Upgrade-Insecure-Requests 1", ": test"])(
    "Fail when parsing an invalid header",
    (header) => {
      const request =
        `GET / HTTP/1.1 otherInformation\r\n` +
        `Host: localhost:8088\r\n` +
        `${header}\r\n`;

      expect(() => parseRequest(request)).toThrowError(InvalidRequestError);
    }
  );
});

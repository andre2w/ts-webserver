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
      `Upgrade-Insecure-Requests: 1\r\n\r\n`;

    let httpRequest: HttpRequest = parseRequest(request);
    let expectedRequest = new HttpRequest({
      method: "GET",
      uri: "/",
      version: "HTTP/1.1",
    });
    expectedRequest.addHeader(
      "Accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    );
    expectedRequest.addHeader("Accept-Language", "en-GB,en;q=0.5");
    expectedRequest.addHeader("Accept-Encoding", "gzip, deflate");
    expectedRequest.addHeader("Connection", "keep-alive");
    expectedRequest.addHeader("Upgrade-Insecure-Requests", "1");
    expectedRequest.addHeader("Host", "localhost:8088");
    expectedRequest.addHeader(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0"
    );
    expectedRequest.addCookie("aCookie", "withValue");
    expectedRequest.addCookie("otherCookie", "withAnotherValue");

    expect(httpRequest).toStrictEqual(expectedRequest);
  });

  test.each(["GET HTTP/1.1", "GET", ""])(
    "Fail parsing when request has missing information",
    (line) => {
      const request =
        `${line}\r\n` +
        `Host: localhost:8088\r\n` +
        `Upgrade-Insecure-Requests: 1\r\n\r\n`;

      expect(() => parseRequest(request)).toThrowError(InvalidRequestError);
    }
  );

  test("should allow requests with more information than needed", () => {
    const request =
      `GET / HTTP/1.1 otherInformation\r\n` +
      `Host: localhost:8088\r\n` +
      `Upgrade-Insecure-Requests: 1\r\n\r\n`;

    const expectedRequest = new HttpRequest({
      method: "GET",
      uri: "/",
      version: "HTTP/1.1",
    });
    expectedRequest.addHeader("Upgrade-Insecure-Requests", "1");
    expectedRequest.addHeader("Host", "localhost:8088");

    expect(parseRequest(request)).toStrictEqual(expectedRequest);
  });

  test.each(["Upgrade-Insecure-Requests 1", ": test"])(
    "Fail when parsing an invalid header",
    (header) => {
      const request =
        `GET / HTTP/1.1 otherInformation\r\n` +
        `Host: localhost:8088\r\n` +
        `${header}\r\n\r\n`;

      expect(() => parseRequest(request)).toThrowError(InvalidRequestError);
    }
  );

  test("should allow to parse all query parameters", () => {
    const request = `GET /query?id=123&test=value HTTP/1.1\r\nHost: localhost:8088\r\n\r\n`;

    const expectedRequest = new HttpRequest({
      method: "GET",
      uri: "/query",
      version: "HTTP/1.1",
    });
    expectedRequest.addParam("id", "123");
    expectedRequest.addParam("test", "value");
    expectedRequest.addHeader("Host", "localhost:8088");
    expect(parseRequest(request)).toStrictEqual(expectedRequest);
  });
});

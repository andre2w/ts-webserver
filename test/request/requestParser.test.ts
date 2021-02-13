import { parseRequest } from "../../src/request/requestParser";
import { HttpRequest, InvalidRequestError } from "../../src/http";

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
    expectedRequest.addHeader("host", "localhost:8088");
    expectedRequest.addHeader(
      "user-agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0"
    );
    expectedRequest.addHeader(
      "accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8"
    );
    expectedRequest.addHeader("accept-language", "en-GB,en;q=0.5");
    expectedRequest.addHeader("accept-encoding", "gzip, deflate");
    expectedRequest.addHeader("connection", "keep-alive");
    expectedRequest.addHeader("upgrade-insecure-requests", "1");
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
    expectedRequest.addHeader("host", "localhost:8088");
    expectedRequest.addHeader("upgrade-insecure-requests", "1");

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

  test.each([
    { values: [{ key: "id", value: "123" }] },
    {
      values: [
        { key: "id", value: "123" },
        { key: "test", value: "value" },
      ],
    },
  ])("should allow to parse all query parameters", (params) => {
    const query = params.values
      .map((param) => `${param.key}=${param.value}`)
      .join("&");

    const request = `GET /query?${query} HTTP/1.1\r\nHost: localhost:8088\r\n\r\n`;

    const expectedRequest = new HttpRequest({
      method: "GET",
      uri: "/query",
      version: "HTTP/1.1",
    });
    params.values.forEach((param) =>
      expectedRequest.addParam(param.key, param.value)
    );

    expectedRequest.addHeader("host", "localhost:8088");
    expect(parseRequest(request)).toStrictEqual(expectedRequest);
  });

  test("should throw exception when query parameter is invalid", () => {
    const request = `GET /query?id123&test=value HTTP/1.1\r\nHost: localhost:8088\r\n\r\n`;

    expect(() => parseRequest(request)).toThrowError(InvalidRequestError);
  });

  test("should parse query parameters decoding values", () => {
    const request =
      `GET /query?id=123&other=value%3D%40%24 HTTP/1.1\r\n` +
      `Host: localhost:8088\r\n\r\n`;

    const parsedRequest = parseRequest(request);
    const expectedRequest = new HttpRequest({
      method: "GET",
      uri: "/query",
      version: "HTTP/1.1",
    });
    expectedRequest.addParam("id", "123");
    expectedRequest.addParam("other", "value=@$");
    expectedRequest.addHeader("host", "localhost:8088");

    expect(parsedRequest).toStrictEqual(expectedRequest);
  });

  test("should parse request with body", () => {
    const requestBody = JSON.stringify({
      id: 123,
      aValue: "with a text here",
      anotherValue: "that also has text",
    });
    const request =
      `POST /post HTTP/1.1\r\n` +
      `Host: localhost:8088\r\n` +
      `\r\n` +
      `${requestBody}\r\n`;

    const httpRequest = parseRequest(request);
    expect(httpRequest.body).toBe(requestBody);
  });

  test("should parse request from form data when the header is present", () => {
    const request =
      `POST /post HTTP/1.1\r\n` +
      `Host: localhost:8088\r\n` +
      `Content-Type: application/x-www-form-urlencoded\r\n` +
      `\r\n` +
      `id=123&other=value%3D%40%24\r\n`;

    const expectedFormData = new Map<string, string>();
    expectedFormData.set("id", "123");
    expectedFormData.set("other", "value=@$");

    const httpRequest = parseRequest(request);
    expect(httpRequest.formData).toStrictEqual(expectedFormData);
  });
});

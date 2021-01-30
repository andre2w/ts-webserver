import { buildResponse } from "../../src/response/buildResponse";
import { HttpResponse } from "../../src/Http";

describe("Building an HTTP response", () => {
  test("building basic response with body", () => {
    const httpResponse = new HttpResponse(200, "Hello there!");
    httpResponse.addHeader("X-Correlation-Id", "123");
    const builtResponse = buildResponse(httpResponse);

    const expectedResponse =
      `HTTP/1.1 200 OK\r\n` +
      `Server: ts-webserver\r\n` +
      `Content-Length: 12\r\n` +
      `X-Correlation-Id: 123\r\n` +
      `\r\n` +
      `Hello there!\r\n`;
    expect(builtResponse).toBe(expectedResponse);
  });

  test("building basic response without body", () => {
    const httpResponse = new HttpResponse(200);
    httpResponse.addHeader("X-Correlation-Id", "123");
    const builtResponse = buildResponse(httpResponse);

    const expectedResponse =
      `HTTP/1.1 200 OK\r\n` +
      `Server: ts-webserver\r\n` +
      `Content-Length: 0\r\n` +
      `X-Correlation-Id: 123\r\n` +
      `\r\n`;
    expect(builtResponse).toBe(expectedResponse);
  });

  describe("response should be able to set cookie", () => {
    test("set a regular cookie", () => {
      const httpResponse = new HttpResponse(200);
      httpResponse.addCookie("signedIn", "true");
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true\r\n` +
        `\r\n`;

      expect(builtResponse).toBe(expectedResponse);
    });

    test("set a cookie with expire date", () => {
      const httpResponse = new HttpResponse(200);
      const cookieExpiration = new Date(2021, 2, 1, 10, 10, 10);
      httpResponse.addCookie("signedIn", "true", { expires: cookieExpiration });
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true; Expires=${cookieExpiration.toUTCString()}\r\n` +
        `\r\n`;

      expect(builtResponse).toBe(expectedResponse);
    });

    test("set a cookie with Max Age", () => {
      const httpResponse = new HttpResponse(200);
      httpResponse.addCookie("signedIn", "true", { maxAge: 150 });
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true; Max-Age=150\r\n` +
        `\r\n`;

      expect(builtResponse).toBe(expectedResponse);
    });

    test("set a cookie with domain", () => {
      const httpResponse = new HttpResponse(200);
      httpResponse.addCookie("signedIn", "true", { domain: "example.org" });
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true; Domain=example.org\r\n` +
        `\r\n`;

      expect(builtResponse).toBe(expectedResponse);
    });

    test("set a cookie with a path", () => {
      const httpResponse = new HttpResponse(200);
      httpResponse.addCookie("signedIn", "true", { path: "/customers" });
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true; Path=/customers\r\n` +
        `\r\n`;

      expect(builtResponse).toBe(expectedResponse);
    });

    test("set a secure cookie", () => {
      const httpResponse = new HttpResponse(200);
      httpResponse.addCookie("signedIn", "true", { secure: true });
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true; Secure\r\n` +
        `\r\n`;

      expect(builtResponse).toBe(expectedResponse);
    });

    test("should not add the Secure tag when attribute is false", () => {
      const httpResponse = new HttpResponse(200);
      httpResponse.addCookie("signedIn", "true", { secure: false });
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true\r\n` +
        `\r\n`;

      expect(builtResponse).toBe(expectedResponse);
    });
  });
});

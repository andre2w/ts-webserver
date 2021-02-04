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

    test("set a httpOnly cookie", () => {
      const httpResponse = new HttpResponse(200);
      httpResponse.addCookie("signedIn", "true", { httpOnly: true });
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true; HttpOnly\r\n` +
        `\r\n`;

      expect(builtResponse).toBe(expectedResponse);
    });

    test("set a cookie with the same site attribute", () => {
      const httpResponse = new HttpResponse(200);
      httpResponse.addCookie("signedIn", "true", { sameSite: "Strict" });
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true; SameSite=Strict\r\n` +
        `\r\n`;

      expect(builtResponse).toBe(expectedResponse);
    });

    test("set a cookie with multiple attributes", () => {
      const httpResponse = new HttpResponse(200);
      httpResponse.addCookie("signedIn", "true", {
        httpOnly: true,
        sameSite: "Lax",
        maxAge: 150,
      });
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true; HttpOnly; SameSite=Lax; Max-Age=150\r\n` +
        `\r\n`;
      expect(builtResponse).toBe(expectedResponse);
    });

    test("set a cookie with all the attributes", () => {
      const httpResponse = new HttpResponse(200);
      const expireDate = new Date(2021, 3, 1, 10, 10, 10);
      httpResponse.addCookie("signedIn", "true", {
        httpOnly: true,
        sameSite: "None",
        maxAge: 150,
        expires: expireDate,
        domain: "example.org",
        path: "/customers",
        secure: true,
      });
      const builtResponse = buildResponse(httpResponse);

      const expectedResponse =
        `HTTP/1.1 200 OK\r\n` +
        `Server: ts-webserver\r\n` +
        `Content-Length: 0\r\n` +
        `Set-Cookie: signedIn=true; HttpOnly; SameSite=None; Max-Age=150; Expires=${expireDate.toUTCString()}; Domain=example.org; Path=/customers; Secure\r\n` +
        `\r\n`;
      expect(builtResponse).toBe(expectedResponse);
    });
  });

  test("build complex response", () => {
    const httpResponse = new HttpResponse(200, "response body");
    const expireDate = new Date(2021, 3, 1, 10, 10, 10);
    httpResponse.addCookie("signedIn", "true", {
      httpOnly: true,
      sameSite: "None",
      maxAge: 150,
      expires: expireDate,
      domain: "example.org",
      path: "/customers",
      secure: true,
    });
    httpResponse.addCookie("otherCookie", "value");
    httpResponse.addHeader("testHeader", "header value");
    httpResponse.addHeader("X-Correlation-Id", "123");
    const builtResponse = buildResponse(httpResponse);

    const expectedResponse =
      `HTTP/1.1 200 OK\r\n` +
      `Server: ts-webserver\r\n` +
      `Content-Length: 13\r\n` +
      `testHeader: header value\r\n` +
      `X-Correlation-Id: 123\r\n` +
      `Set-Cookie: signedIn=true; HttpOnly; SameSite=None; Max-Age=150; Expires=${expireDate.toUTCString()}; Domain=example.org; Path=/customers; Secure\r\n` +
      `Set-Cookie: otherCookie=value\r\n` +
      `\r\n` +
      `response body\r\n`;
    expect(builtResponse).toBe(expectedResponse);
  });

  test("build response with json body", () => {
    const responseBody = JSON.stringify({
      id: 123,
      test: "value",
      otherField: "otherValue",
    });
    const httpResponse = new HttpResponse(200, responseBody);

    const expectedResponse =
      `HTTP/1.1 200 OK\r\n` +
      `Server: ts-webserver\r\n` +
      `Content-Length: ${responseBody.length}\r\n\r\n` +
      `${responseBody}\r\n`;
    expect(buildResponse(httpResponse)).toBe(expectedResponse);
  });

  test("should contain correct http code name", () => {
    const httpResponse = new HttpResponse(400);

    const expectedResponse =
      `HTTP/1.1 400 Bad Request\r\n` +
      `Server: ts-webserver\r\n` +
      `Content-Length: 0\r\n\r\n`;
    expect(buildResponse(httpResponse)).toBe(expectedResponse);
  });
});

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
  });
});

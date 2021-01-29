import { buildResponse } from "../../src/response/buildResponse";
import { HttpResponse } from "../../src/Http";

describe("Building an HTTP response", () => {
  test("building basic response", () => {
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
});

import { buildResponse } from "./buildResponse";

describe("Building an HTTP response", () => {
  test("building basic response", () => {
    let httpResponse = {
      code: 200,
      body: "Hello there!",
      headers: {
        "X-Correlation-Id": "123",
      },
    };

    let builtResponse = buildResponse(httpResponse);

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

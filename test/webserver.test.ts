import Webserver from "../src/webserver";
import axios from "axios";
import { HttpResponse, InvalidRequestError } from "../src/Http";

describe("A webserver", () => {
  const webserver = new Webserver();
  const port = 8088;

  beforeAll(() => {
    webserver.start(port, (request) => {
      if (request.uri === "/success") {
        return new HttpResponse(200, "Request Successful");
      } else if (request.uri.startsWith("/query")) {
        const response = JSON.stringify({
          id: request.params.get("id"),
          test: request.params.get("test"),
        });
        JSON.parse(response);
        return new HttpResponse(200, response);
      } else {
        throw new InvalidRequestError();
      }
    });
  });

  test("Can receive simple get requests", async () => {
    const response = await axios.get<string>(
      `http://localhost:${port}/success`
    );

    expect(response.data).toBe("Request Successful");
    expect(response.status).toBe(200);
  });

  test("Return error response when fails to parse request", async () => {
    try {
      await axios.get<string>(`http://localhost:${port}/error`);
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });

  test("Parse request parameters", async () => {
    const params = { params: { id: 123, test: "value" } };
    const response = await axios.get<string>(
      `http://localhost:${port}/query`,
      params
    );

    expect(response.data).toStrictEqual({ id: "123", test: "value" });
  });

  afterAll(() => {
    webserver.stop();
  });
});

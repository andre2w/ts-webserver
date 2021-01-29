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

  afterAll(() => {
    webserver.stop();
  });
});

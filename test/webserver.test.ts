import Webserver from "../src/webserver";
import axios from "axios";
import { InvalidRequestError } from "../src/HttpRequest";

describe("A webserver", () => {
  test("Can receive simple get requests", async () => {
    const webserver = new Webserver();
    webserver.start(8088, () => {
      return {
        code: 200,
        body: "Request Successful",
        headers: {},
      };
    });

    const response = await axios.get<string>("http://localhost:8088");
    webserver.stop();
    expect(response.data).toEqual("Request Successful");
  });

  test("Return error response when fails to parse request", async () => {
    const webserver = new Webserver();
    const port = 8088;
    const mockFn = jest.fn(() => {
      throw new InvalidRequestError();
    });
    webserver.start(port, mockFn);

    const response = await axios.get<string>(`http://localhost:${port}`);
    console.log(response);
    webserver.stop();
    expect(response.status).toEqual(400);
  });
});

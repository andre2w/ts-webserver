import Webserver from "../src/webserver";
import axios from "axios";
import { HttpResponse, InvalidRequestError } from "../src/Http";

describe("A webserver", () => {
  test("Can receive simple get requests", async () => {
    const webserver = new Webserver();
    webserver.start(8088, () => new HttpResponse(200, "Request Successful"));

    const response = await axios.get<string>("http://localhost:8088");
    webserver.stop();
    expect(response.data).toEqual("Request Successful");
  });

  xtest("Return error response when fails to parse request", async () => {
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

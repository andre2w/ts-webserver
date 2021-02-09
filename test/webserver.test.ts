import Webserver from "../src/webserver";
import axios from "axios";
import { HttpResponse, InvalidRequestError } from "../src/http";

function createFormData(...formData: [string, string][]): string {
  return formData
    .map((entry) => `${entry[0]}=${encodeURIComponent(entry[1])}`)
    .join("&");
}

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
      } else if (request.uri === "/post") {
        return new HttpResponse(200, request.body);
      } else if (request.uri === "/post/form") {
        let responseBody: { [x: string]: string } = {};
        if (request.formData !== undefined) {
          for (let data of request.formData) {
            if (data[0] !== "id") {
              responseBody[data[0]] = data[1];
            }
          }
        }
        return new HttpResponse(201, JSON.stringify(responseBody));
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
    const params = { params: { id: 123, test: "value#@!" } };
    const response = await axios.get<string>(
      `http://localhost:${port}/query`,
      params
    );

    expect(response.data).toStrictEqual({ id: "123", test: "value#@!" });
  });

  test("POST request with JSON body", async () => {
    const body = {
      id: 123,
      field: "value",
      otherField: "otherValue",
    };
    const response = await axios.post(`http://localhost:${port}/post`, body);

    expect(response.data).toStrictEqual(body);
  });

  test("POST request with form data", async () => {
    const body = createFormData(
      ["id", "123"],
      ["key", "value"],
      ["field", "!@#$"]
    );
    const response = await axios.post(
      `http://localhost:${port}/post/form`,
      body,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    expect(response.data).toStrictEqual({ key: "value", field: "!@#$" });
  });

  afterAll(() => {
    webserver.stop();
  });
});

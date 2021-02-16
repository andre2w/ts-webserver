import axios from "axios";
import { TestApplication } from "./TestApplication";

function createFormData(...formData: [string, string][]): string {
  return formData
    .map((entry) => `${entry[0]}=${encodeURIComponent(entry[1])}`)
    .join("&");
}

describe("A webserver", () => {
  const testApplication = new TestApplication();
  const port = 8088;

  beforeAll(() => {
    testApplication.start(port);
  });

  describe("When receiving a GET request", () => {
    test("Have a successful response with status 2XX", async () => {
      const response = await axios.get<string>(
        `http://localhost:${port}/success`
      );

      expect(response.data).toBe("Request Successful");
      expect(response.status).toBe(200);
    });

    test("Can parse the query parameters in the string", async () => {
      const params = { params: { id: 123, test: "value#@!" } };
      const response = await axios.get<string>(
        `http://localhost:${port}/query`,
        params
      );

      expect(response.data).toStrictEqual({ id: "123", test: "value#@!" });
    });
  });

  describe("When receiving a POST request", () => {
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
  });

  test("Return error response when fails to parse request", async () => {
    try {
      await axios.get<string>(`http://localhost:${port}/error`);
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });

  afterAll(() => {
    testApplication.stop();
  });
});

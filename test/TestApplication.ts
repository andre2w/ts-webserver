import Webserver from "../src/webserver";
import { HttpRequest, HttpResponse, InvalidRequestError } from "../src/http";

export class TestApplication {
  private readonly webserver = new Webserver();

  start(port: number): void {
    this.webserver.start(port, this.handleRequest);
  }

  stop(): void {
    this.webserver.stop();
  }

  private handleRequest: (request: HttpRequest) => HttpResponse = (
    request: HttpRequest
  ) => {
    if (request.uri === "/success") {
      return new HttpResponse(200, "Request Successful");
    } else if (request.uri.startsWith("/query")) {
      const response = JSON.stringify({
        id: request.params.get("id"),
        test: request.params.get("test"),
      });
      return new HttpResponse(200, response);
    } else if (request.uri === "/post") {
      return new HttpResponse(200, request.body);
    } else if (request.uri === "/post/form") {
      const responseBody: { [x: string]: string } = {};
      if (request.formData !== undefined) {
        for (const data of request.formData) {
          if (data[0] !== "id") {
            responseBody[data[0]] = data[1];
          }
        }
      }
      return new HttpResponse(201, JSON.stringify(responseBody));
    } else {
      throw new InvalidRequestError();
    }
  };
}

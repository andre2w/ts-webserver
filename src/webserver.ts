import * as net from "net";
import { parseRequest } from "./request/requestParser";
import { HttpRequest } from "./HttpRequest";
import { buildResponse, HttpResponse } from "./response/buildResponse";

export default class Webserver {
  private server?: net.Server;

  start(port: number, requestHandler: (request: HttpRequest) => HttpResponse) {
    this.server = net.createServer();
    this.server.listen(port);

    this.server.on("connection", (conn) => {
      conn.on("data", (data) => {
        let httpResponse: string;
        try {
          httpResponse = buildResponse(
            requestHandler(parseRequest(data.toString()))
          );
        } catch (error) {
          httpResponse = buildResponse({
            code: 400,
            body: "",
            headers: {},
          });
        }

        conn.write(httpResponse);
      });

      conn.on("close", () => {});

      conn.on("error", () => {});
    });
  }

  stop() {
    this.server?.close();
  }
}

import * as net from "net";
import { parseRequest } from "./request/requestParser";
import { buildResponse } from "./response/buildResponse";
import { HttpRequest, HttpResponse } from "./http";

export default class Webserver {
  private server?: net.Server;

  start(port: number, requestHandler: (request: HttpRequest) => HttpResponse) {
    this.server = net.createServer();
    this.server.listen(port);

    this.server.on("connection", (conn) => {
      conn.on("data", (data) => {
        let response: string;
        try {
          const httpRequest = parseRequest(data.toString());
          const httpResponse = requestHandler(httpRequest);
          response = buildResponse(httpResponse);
        } catch (error) {
          response = buildResponse(new HttpResponse(400));
        }

        conn.write(response);
      });

      conn.on("close", () => {});

      conn.on("error", () => {});
    });
  }

  stop() {
    this.server?.close();
  }
}

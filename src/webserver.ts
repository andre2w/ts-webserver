import * as net from "net";
import { parseRequest } from "./parser/requestParser";
import { HttpRequest } from "./HttpRequest";
import { buildResponse, HttpResponse } from "./response/buildResponse";

export default class Webserver {
  private server?: net.Server;

  start(port: number, requestHandler: (request: HttpRequest) => HttpResponse) {
    this.server = net.createServer();
    this.server.listen(port);

    this.server.on("connection", (conn) => {
      console.log("connection");

      conn.on("data", (data) => {
        let httpResponse = requestHandler(parseRequest(data.toString()));
        conn.write(buildResponse(httpResponse));
      });

      conn.on("close", () => {
        console.log("Connection closed");
      });

      conn.on("error", () => {
        console.log("oh no!");
      });
    });

    console.log("Everything done, server started");
  }

  stop() {
    this.server?.close();
  }
}

import * as net from "net";
import { parseRequest, HttpRequest } from "./parser/request-parser";

export default class Webserver {
  private server?: net.Server;

  start(port: number, requestHandler: (request: HttpRequest) => string) {
    this.server = net.createServer();
    this.server.listen(port);

    this.server.on("connection", (conn) => {
      console.log("connection");

      conn.on("data", (data) => {
        console.log(data.toString());
        let response = requestHandler(parseRequest(data.toString()));
        conn.write(response);
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

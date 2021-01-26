import * as net from "net";

export default class Webserver {
  start(port: number) {
    const server = net.createServer();

    server.on("connection", (conn) => {
      console.log("connection");

      conn.on("data", (data) => {
        console.log(`${data}`);
        conn.write(data);
      });

      conn.on("close", () => {
        console.log("Connection closed");
      });

      conn.on("error", () => {
        console.log("oh no!");
      });
    });

    server.listen(port, () => {
      console.log(`listening on ${port}`);
    });

    console.log("Everything done, server started");
  }
}

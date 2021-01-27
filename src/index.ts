import Webserver from "./webserver";

const webserver = new Webserver();
webserver.start(8088, (request) => {
  console.log(request);
  return `Request received ${request.version}`;
});

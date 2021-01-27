import Webserver from "./webserver";

const webserver = new Webserver();
webserver.start(8088, (request) => {
  console.log(request);
  return {
    code: 200,
    body: `Request received ${request.version}`,
    headers: {},
  };
});

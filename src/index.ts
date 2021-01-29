import Webserver from "./webserver";
import { HttpResponse } from "./Http";

const webserver = new Webserver();
webserver.start(8088, (request) => {
  const responseBody = JSON.stringify({
    field: request.version,
    otherField: "otherValue",
    somethingHere: "also here",
    andANumber: 132,
    throwABoolean: true,
  });

  return new HttpResponse(200, responseBody);
});

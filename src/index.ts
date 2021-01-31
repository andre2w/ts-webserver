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

  let response = new HttpResponse(200, responseBody);
  const expireDate = new Date(2021, 3, 1, 10, 10, 10);
  response.addCookie("signedIn", "true", {
    httpOnly: true,
    sameSite: "None",
    maxAge: 150000,
    expires: expireDate,
    domain: "localhost",
    path: "/customers",
    secure: true,
  });

  return response;
});

import Webserver from "./webserver";
import { HttpRequest, HttpResponse } from "./http";

const webserver = new Webserver();
webserver.start(8088, (request) => {
  if (request.method === "POST") {
    return postRequest(request);
  } else {
    return getRequest(request);
  }
});

function getRequest(request: HttpRequest) {
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
}

function postRequest(request: HttpRequest) {
  return new HttpResponse(201, request.body);
}

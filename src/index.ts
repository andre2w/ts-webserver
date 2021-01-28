import Webserver from "./webserver";

const webserver = new Webserver();
webserver.start(8088, (request) => {
  const responseBody = JSON.stringify({
    field: request.version,
    otherField: "otherValue",
    somethingHere: "also here",
    andANumber: 132,
    throwABoolean: true,
  });

  return {
    code: 200,
    body: responseBody,
    headers: {
      "X-Correlation-Id": "asdfsdf-asdf",
    },
  };
});

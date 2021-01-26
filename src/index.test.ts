import helloWorld from "./index";

test("Must say hello world", () => {
  expect(helloWorld()).toBe("Hello, World!");
});

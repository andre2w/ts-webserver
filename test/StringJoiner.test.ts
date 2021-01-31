import StringJoiner from "../src/StringJoiner";

describe("StringJoiner", () => {
  test("join added strings with specified delimiter", () => {
    const stringJoiner = new StringJoiner("\n");

    stringJoiner.add("First Line");
    stringJoiner.add("Second Line");

    expect(stringJoiner.toString()).toBe("First Line\nSecond Line");
  });

  test("empty string should count", () => {
    const stringJoiner = new StringJoiner("\n");

    stringJoiner.add("First Line");
    stringJoiner.add("");
    stringJoiner.add("Second Line");

    expect(stringJoiner.toString()).toBe("First Line\n\nSecond Line");
  });

  test("allow to have a preffix final string", () => {
    const stringJoiner = new StringJoiner("\n", { preffix: "=>" });

    stringJoiner.add("test");
    stringJoiner.add("other");

    expect(stringJoiner.toString()).toBe("=>test\nother");
  });

  test("allow to have a suffix to final string", () => {
    const stringJoiner = new StringJoiner("\n", { suffix: "<=" });

    stringJoiner.add("test");
    stringJoiner.add("other");

    expect(stringJoiner.toString()).toBe("test\nother<=");
  });
});

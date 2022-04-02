import { describe, expect, it, run } from "./dev_deps.ts";
import { parseBrainfuck, translate } from "./translate.ts";
import { Operation } from "./types.ts";

describe("Translate", () => {
  it("parses", () => {
    const ops = parseBrainfuck("<>");
    expect(ops).toEqual([Operation.LEFT, Operation.RIGHT]);
  });

  it("translates", () => {
    const src = translate([Operation.LEFT, Operation.RIGHT]);
    expect(src).toEqual("transfem transmasc");
  });

  it("translates pronouns", () => {
    const src = translate([
      Operation.INC,
      Operation.INC,
      Operation.INC,
      Operation.DEC,
      Operation.DEC,
      Operation.DEC,
    ]);

    expect(src).toEqual("he they she him them her");
  });
});

run();

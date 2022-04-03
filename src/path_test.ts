import { describe, expect, it, run } from "./dev_deps.ts";
import { substituteExtension } from "./path.ts";

describe("Path utils", () => {
  it("substitutes extensions", () => {
    expect(substituteExtension("foo.txt", "pdf")).toEqual("foo.pdf");
  });

  it("substitutes extensions with starting period", () => {
    expect(substituteExtension("foo.txt", ".pdf")).toEqual("foo.pdf");
  });
});

run();

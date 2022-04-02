import { CodeGenerator } from "./wasmgen.ts";
import { describe, expect, it, run } from "./dev_deps.ts";
import { Operation } from "./types.ts";
import { RunParams, runWasm } from "./run.ts";

describe("CodeGenerator", () => {
  async function runOps(ops: Operation[], params: RunParams = {}) {
    const generator = new CodeGenerator();
    generator.addOperations(ops);
    return await runWasm(generator.compileBinary(), params);
  }

  it("left", async () => {
    const result = await runOps([Operation.LEFT]);
    expect(result.ptr).toEqual(-1);
  });

  it("right", async () => {
    const result = await runOps([Operation.RIGHT]);
    expect(result.ptr).toEqual(1);
  });

  it("dec", async () => {
    const result = await runOps([Operation.DEC]);
    expect(result.memory[0]).toEqual(255);
  });

  it("inc", async () => {
    const result = await runOps([Operation.INC]);
    expect(result.memory[0]).toEqual(1);
  });

  it("out", async () => {
    const incs: Operation[] = [];
    incs.length = 35;
    incs.fill(Operation.INC, 0, 34);
    incs.push(Operation.OUTPUT);
    await runOps(incs, { outFn: (val) => expect(val).toEqual(34) });
  });

  it("in", async () => {
    const result = await runOps([Operation.INPUT], { inFn: () => 34 });
    expect(result.memory[0]).toEqual(34);
  });
});

run();

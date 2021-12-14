import { CodeGenerator } from './wasmgen.ts';
import { describe, expect, it, run } from 'https://deno.land/x/tincan/mod.ts';
import { Operation } from './types.ts';
import { runWasm } from './run.ts';

describe('CodeGenerator', () => {
  async function runOps(ops: Operation[]) {
    const generator = new CodeGenerator();
    generator.addOperations(ops);
    return await runWasm(generator.compileBinary());
  }

  it('left', async () => {
    const result = await runOps([Operation.LEFT]);
    expect(result.ptr).toEqual(-1);
  });

  it('right', async () => {
    const result = await runOps([Operation.RIGHT]);
    expect(result.ptr).toEqual(1);
  });

  it('dec', async () => {
    const result = await runOps([Operation.DEC]);
    expect(result.memory[0]).toEqual(255);
  });

  it('inc', async () => {
    const result = await runOps([Operation.INC]);
    expect(result.memory[0]).toEqual(1);
  });
});

run();

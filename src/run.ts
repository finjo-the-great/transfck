import { init, WASI } from 'https://deno.land/x/wasm@v1.0.0/wasi.ts';

export interface RunResult {
  readonly memory: Uint8Array;
  readonly ptr: number;
}

export async function runWasm(bin: Uint8Array): Promise<RunResult> {
  const instance = await WebAssembly.instantiate(bin, {});
  (instance.instance.exports.main as any)();
  const buffer = (instance.instance.exports.memory as WebAssembly.Memory)
    .buffer;
  const array = new Uint8Array(buffer);
  return {
    memory: array,
    ptr: (instance.instance.exports.getPtr as () => number)(),
  };
}

export interface RunResult {
  readonly memory: Uint8Array;
  readonly ptr: number;
}

export interface RunParams {
  inFn?: () => number;
  outFn?: (c: number) => void;
}

export async function runWasm(
  bin: Uint8Array,
  params: RunParams = {},
): Promise<RunResult> {
  const instance = await WebAssembly.instantiate(bin, {
    main: {
      out: params.outFn ??
        ((c: number) => {
          const char = new Uint8Array([c]);
          Deno.stdout.writeSync(char);
        }),
      in: params.inFn ??
        (() => {
          const buffer = new Uint8Array(1);
          Deno.stdin.readSync(buffer);
          return buffer[0];
        }),
    },
  });
  (instance.instance.exports.main as () => void)();
  const buffer = (instance.instance.exports.memory as WebAssembly.Memory)
    .buffer;
  const array = new Uint8Array(buffer);
  return {
    memory: array,
    ptr: (instance.instance.exports.getPtr as () => number)(),
  };
}

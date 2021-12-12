import binaryen from "https://esm.sh/binaryen";

export class WasmGenerator {
  readonly module = new binaryen.Module();

  constI32(num: number) {
    return this.module.i32.const(num);
  }
}

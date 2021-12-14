import binaryen from 'https://esm.sh/binaryen';
import { Operation, OperationList } from './types.ts';

export class CodeGenerator {
  private readonly binModule = new binaryen.Module();

  constructor() {
    this.binModule.addGlobal(
      'ptr',
      binaryen.i32,
      true,
      this.binModule.i32.const(0)
    );

    this.binModule.addFunction(
      'getPtr',
      binaryen.createType([]),
      binaryen.createType([binaryen.i32]),
      [],
      this.ptr()
    );
    this.binModule.addFunctionExport('getPtr', 'getPtr');

    this.binModule.setMemory(1, 1, 'memory');
  }

  ptr() {
    return this.binModule.global.get('ptr', binaryen.i32);
  }

  addOperations(ops: OperationList) {
    const wasmOps = [];
    for (const op of ops) {
      if (op instanceof Array) continue;

      switch (op) {
        case Operation.LEFT:
          wasmOps.push(
            this.binModule.global.set(
              'ptr',
              this.binModule.i32.sub(this.ptr(), this.binModule.i32.const(1))
            )
          );
          break;
        case Operation.RIGHT:
          wasmOps.push(
            this.binModule.global.set(
              'ptr',
              this.binModule.i32.add(this.ptr(), this.binModule.i32.const(1))
            )
          );
          break;
        case Operation.INC: {
          const ptr = this.ptr();
          const load = this.binModule.i32.load8_u(0, 1, ptr);
          const result = this.binModule.i32.add(
            load,
            this.binModule.i32.const(1)
          );
          const store = this.binModule.i32.store8(0, 1, ptr, result);
          wasmOps.push(store);
          break;
        }
        case Operation.DEC: {
          const ptr = this.ptr();
          const load = this.binModule.i32.load8_u(0, 1, ptr);
          const result = this.binModule.i32.sub(
            load,
            this.binModule.i32.const(1)
          );
          const store = this.binModule.i32.store8(0, 1, ptr, result);
          wasmOps.push(store);
          break;
        }
      }
    }
    const block = this.binModule.block('trans', wasmOps);
    this.binModule.addFunction(
      'main',
      binaryen.createType([]),
      binaryen.createType([]),
      [],
      block
    );
    this.binModule.addFunctionExport('main', 'main');

    this.binModule.validate();
    this.binModule.autoDrop();
  }

  compileText() {
    return this.binModule.emitText();
  }

  compileBinary() {
    this.binModule.optimize();
    return this.binModule.emitBinary();
  }
}

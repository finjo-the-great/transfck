import { binaryen, parseFlags } from './deps.ts';

declare const WebAssembly: any;

const binModule = new binaryen.Module();
try {
  binModule.addGlobal('ptr', binaryen.i32, true, binModule.i32.const(0));

  binModule.setMemory(1, 30000, 'mem');
  console.log(binModule.memory.size());

  // Start to create the function, starting with the contents: Get the 0 and
  // 1 arguments, and add them, then return them
  const left = binModule.local.get(0, binaryen.i32);
  const right = binModule.local.get(1, binaryen.i32);
  const add = binModule.i32.add(left, right);
  const add2 = binModule.i32.add(
    add,
    binModule.i32.load(0, 0, binModule.global.get('ptr', binaryen.i32))
  );
  const ret = binModule.block('fn', [
    binModule.global.set(
      'ptr',
      binModule.i32.add(
        binModule.i32.const(1),
        binModule.global.get('ptr', binaryen.i32)
      )
    ),
    binModule.i32.store(
      0,
      0,
      binModule.global.get('ptr', binaryen.i32),
      binModule.i32.const(100)
    ),
    binModule.return(add2),
  ]);

  // Create the add function
  // Note: no additional local variables (that's the [])
  const ii = binaryen.createType([binaryen.i32, binaryen.i32]);
  binModule.addFunction('adder', ii, binaryen.i32, [], ret);

  // Export the function, so we can call it later (for simplicity we
  // export it as the same name as it has internally)
  binModule.addFunctionExport('adder', 'adder');

  // Print out the text
  console.log(binModule.emitText());
  binModule.autoDrop();

  // Optimize the binModule! This removes the 'return', since the
  // output of the add can just fall through
  binModule.optimize();

  // Print out the optimized binModule's text
  console.log('optimized:\n\n' + binModule.emitText());

  // Get the binary in typed array form
  const binary = binModule.emitBinary();
  console.log('binary size: ' + binary.length);
  console.log();
  console.log(binModule.validate());

  // Compile the binary and create an instance
  const wasm = new WebAssembly.Instance(new WebAssembly.Module(binary), {});
  console.log('exports: ' + Object.keys(wasm.exports).sort().join(','));
  console.log();

  // Call the code!
  console.log('an addition: ' + wasm.exports.adder(40, 2));

  const cmdArgs = parseFlags(Deno.args);
  const outfilePath = cmdArgs['out-file'];
  console.log(cmdArgs);
  Deno.writeTextFile(outfilePath, binModule.emitText());
} finally {
  // We don't need the Binaryen binModule anymore, so we can tell it to
  // clean itself up
  binModule.dispose();
}

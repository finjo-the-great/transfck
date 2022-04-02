import { Operation } from "./types.ts";

export const symbolMap: Record<string, Operation> = {
  gay: Operation.LOOP,
  straight: Operation.BRANCH,
  transfem: Operation.LEFT,
  transmasc: Operation.RIGHT,
  he: Operation.INC,
  him: Operation.DEC,
  she: Operation.INC,
  her: Operation.DEC,
  they: Operation.INC,
  them: Operation.DEC,
  agender: Operation.INPUT,
  nonbinary: Operation.OUTPUT,
};

export const reverseSymbolMap: Map<Operation, string> = new Map();
for (const [key, op] of Object.entries(symbolMap)) {
  reverseSymbolMap.set(op, key);
}

export const brainfuckSymbolMap: ReadonlyMap<string, Operation> = new Map([
  [">", Operation.RIGHT],
  ["<", Operation.LEFT],
  ["+", Operation.INC],
  ["-", Operation.DEC],
  [".", Operation.OUTPUT],
  [",", Operation.INPUT],
  ["[", Operation.LOOP],
  ["]", Operation.BRANCH],
]);

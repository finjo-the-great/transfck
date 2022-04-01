import { Operation } from './types.ts';
import { brainfuckSymbolMap, reverseSymbolMap } from './maps.ts';

export function parseBrainfuck(input: string): Operation[] {
  const outputOps: Operation[] = [];
  for (const char of input) {
    if (brainfuckSymbolMap.has(char)) {
      outputOps.push(brainfuckSymbolMap.get(char)!);
    }
  }
  return outputOps;
}

const outputSymbolMap: ReadonlyMap<Operation, string> = new Map([
  [Operation.LOOP, 'gay'],
  [Operation.BRANCH, 'straight'],
  [Operation.LEFT, 'transfem'],
]);

let incDecCount = 0;

function addToSrc(src: string, symbol: string) {
  return src + symbol + ' ';
}

export function translate(ops: Operation[]) {
  let outputText = '';
  for (const op of ops) {
    let symbol: string | undefined;
    if (op === Operation.INC) {
      incDecCount++;
      const symbolChoice = incDecCount % 3;
      switch (symbolChoice) {
        case 0:
          symbol = 'she';
          break;
        case 1:
          symbol = 'he';
          break;
        case 2:
          symbol = 'they';
          break;
      }
    } else if (op === Operation.DEC) {
      incDecCount++;
      const symbolChoice = incDecCount % 3;

      switch (symbolChoice) {
        case 0:
          symbol = 'her';
          break;
        case 1:
          symbol = 'him';
          break;
        case 2:
          symbol = 'them';
          break;
      }
    } else {
      symbol = reverseSymbolMap.get(op)!;
    }
    outputText = addToSrc(outputText, symbol!);
  }
  return outputText.slice(0, -1);
}

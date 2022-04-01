import { Operation, OperationList } from './types.ts';
import { symbolMap } from './maps.ts';

export function lex(src: string): Operation[] {
  const tokens = src.split(/\s+/);
  return tokens
    .filter((token) => symbolMap[token] != null)
    .map((token) => symbolMap[token]);
}

export function parse(src: string): OperationList {
  const tokens = lex(src);
  const symbolList: OperationList = [];
  const listStack = [symbolList];

  for (const token of tokens) {
    if (token === Operation.LOOP) {
      const newList: OperationList = [];
      listStack[listStack.length - 1].push(newList);
      listStack.push(newList);
    } else if (token === Operation.BRANCH) {
      const oldList = listStack.pop();
      if (oldList === symbolList) {
        throw new Error('This program is too straight');
      }
    } else {
      listStack[listStack.length - 1].push(token);
    }
  }

  if (listStack.length !== 1) {
    throw new Error('This program is too gay');
  }

  return symbolList;
}

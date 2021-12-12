export enum Symbol {
  GAY = 'gay',
  STRAIGHT = 'straight',
  TRANS_FEM = 'transfem',
  TRANS_MASC = 'transmasc',
}

const symbolMap: Record<string, Symbol> = {
  gay: Symbol.GAY,
  straight: Symbol.STRAIGHT,
  transfem: Symbol.TRANS_FEM,
  transmasc: Symbol.TRANS_MASC,
};

export type SymbolList = (Symbol | SymbolList)[];

export function lex(src: string): Symbol[] {
  const tokens = src.split(/\s+/);
  return tokens
    .filter((token) => !!symbolMap[token])
    .map((token) => symbolMap[token]);
}

export function parse(src: string): SymbolList {
  const tokens = lex(src);
  const symbolList: SymbolList = [];
  const listStack = [symbolList];

  for (const token of tokens) {
    if (token === Symbol.GAY) {
      const newList: SymbolList = [];
      listStack[listStack.length - 1].push(newList);
      listStack.push(newList);
    } else if (token === Symbol.STRAIGHT) {
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

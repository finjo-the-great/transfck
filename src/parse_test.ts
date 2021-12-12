import { lex, parse, Symbol } from './parse.ts';
import {
  beforeEach,
  describe,
  expect,
  it,
  run,
} from 'https://deno.land/x/tincan/mod.ts';

describe('parser', () => {
  describe('lexing', () => {
    it('gay straight', () => {
      const vals = lex('gay straight');
      expect(vals).toEqual([Symbol.GAY, Symbol.STRAIGHT]);
    });

    it('excludes unknown tokens', () => {
      const vals = lex('asdf asdf transfem');
      expect(vals).toEqual([Symbol.TRANS_FEM]);
    });

    it('functions with empty list', () => {
      expect(lex('')).toEqual([]);
    });
  });

  describe('parse', () => {
    it('handles flat lists', () => {
      expect(parse('transfem transmasc')).toEqual([
        Symbol.TRANS_FEM,
        Symbol.TRANS_MASC,
      ]);
    });

    it('handles parenthesis', () => {
      expect(parse('gay transmasc transfem straight')).toEqual([
        [Symbol.TRANS_MASC, Symbol.TRANS_FEM],
      ]);
    });

    it('handles nesting', () => {
      expect(parse('gay gay transmasc straight transfem straight')).toEqual([
        [[Symbol.TRANS_MASC], Symbol.TRANS_FEM],
      ]);
    });

    it('raises errors when too straight', () => {
      expect(() => {
        parse('gay straight straight');
      }).toThrow('This program is too straight');
    });

    it('raises errors when too gay', () => {
      expect(() => {
        parse('gay gay straight');
      }).toThrow('This program is too gay');
    });
  });
});

run();

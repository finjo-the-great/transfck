import { lex, parse } from './parse.ts';
import { Operation } from './types.ts';
import { describe, expect, it, run } from './dev_deps.ts';

describe('parser', () => {
  describe('lexing', () => {
    it('gay straight', () => {
      const vals = lex('gay straight');
      expect(vals).toEqual([Operation.LOOP, Operation.BRANCH]);
    });

    it('excludes unknown tokens', () => {
      const vals = lex('asdf asdf transfem');
      expect(vals).toEqual([Operation.LEFT]);
    });

    it('functions with empty list', () => {
      expect(lex('')).toEqual([]);
    });
  });

  describe('parse', () => {
    it('handles flat lists', () => {
      expect(parse('transfem transmasc')).toEqual([
        Operation.LEFT,
        Operation.RIGHT,
      ]);
    });

    it('handles parenthesis', () => {
      expect(parse('gay transmasc transfem straight')).toEqual([
        [Operation.RIGHT, Operation.LEFT],
      ]);
    });

    it('handles nesting', () => {
      expect(parse('gay gay transmasc straight transfem straight')).toEqual([
        [[Operation.RIGHT], Operation.LEFT],
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

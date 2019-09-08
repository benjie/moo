/*
    MIT License

    Copyright (c) Microsoft Corporation. All rights reserved.

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE
*/
// Type definitions for moo 0.5
// Project: https://github.com/tjvr/moo#readme
// Definitions by: Nikita Litvin <https://github.com/deltaidea>
//                 Jörg Vehlow <https://github.com/MofX>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

export as namespace moo;

/**
 * Reserved token for indicating a parse fail.
 */
export const error: { error: true };

/**
 * Reserved token for indicating a fallback rule.
 */
export const fallback: { fallback: true };

export type TypeMapper = (x: string) => string;

export function keywords(kws: { [k: string]: string | string[] }): TypeMapper;

export function compile(rules: Rules): Lexer;

export function states(states: { [x: string]: Rules }, start?: string): Lexer;

export interface Rule {
  match?: RegExp | string | string[];
  /**
   * Moo tracks detailed information about the input for you.
   * It will track line numbers, as long as you apply the `lineBreaks: true`
   * option to any tokens which might contain newlines. Moo will try to warn you if you forget to do this.
   */
  lineBreaks?: boolean;
  /**
   * Moves the lexer to a new state, and pushes the old state onto the stack.
   */
  push?: string;
  /**
   * Returns to a previous state, by removing one or more states from the stack.
   */
  pop?: number;
  /**
   * Moves to a new state, but does not affect the stack.
   */
  next?: string;
  /**
   * You can have a token type that both matches tokens and contains error values.
   */
  error?: true;
  /**
   * Moo doesn't allow capturing groups, but you can supply a transform function, value(),
   * which will be called on the value before storing it in the Token object.
   */
  value?: (x: string) => string;

  /**
   * Used for mapping one set of types to another.
   * See https://github.com/no-context/moo#keywords for an example
   */
  type?: TypeMapper;
}
export interface Rules {
  [x: string]: RegExp | string | string[] | Rule | Rule[];
}

export interface Lexer {
  /**
   * Returns a string with a pretty error message.
   */
  formatError(token: Token, message?: string): string;
  /**
   * Can be used by parsers like nearley to check whether a given token type can be parsed by this lexer.
   */
  has(tokenType: string): boolean;
  /**
   * When you reach the end of Moo's internal buffer, next() will return undefined.
   * You can always reset() it and feed it more data when that happens.
   */
  next(): Token | undefined;
  /**
   * Empty the internal buffer of the lexer, and set the line, column, and offset counts back to their initial value.
   */
  reset(chunk?: string, state?: LexerState): void;
  /**
   * Returns current state, which you can later pass it as the second argument
   * to reset() to explicitly control the internal state of the lexer.
   */
  save(): LexerState;

  [Symbol.iterator](): Iterator<Token>;
}

export interface Token {
  /**
   * Returns value of the token, or its type if value isn't available.
   */
  toString(): string;
  /**
   * The name of the group, as passed to compile.
   */
  type?: string;
  /**
   * The match contents.
   */
  value: string;
  /**
   * The number of bytes from the start of the buffer where the match starts.
   */
  offset: number;
  /**
   * The complete match.
   */
  text: string;
  /**
   * The number of line breaks found in the match. (Always zero if this rule has lineBreaks: false.)
   */
  lineBreaks: number;
  /**
   * The line number of the beginning of the match, starting from 1.
   */
  line: number;
  /**
   * The column where the match begins, starting from 1.
   */
  col: number;
}

export interface LexerState {
  line: number;
  col: number;
  state: string;
}

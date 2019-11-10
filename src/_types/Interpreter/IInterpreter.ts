import {ISymbol} from "../CNF/ICNF";

export type IInterpreterTokenDef<V, C> =
    | {
          match: RegExp | string;
          eval: (text: string, match: RegExpExecArray, context: C) => V;
      }
    | RegExp
    | string;

/** A pattern definition, including the function to execute with the pattern */
export type IInterpreterPattern<V, C> = {
    parts: ISymbol[];
    eval: (children: V[], context: C) => V;
};

/** A symbol definition (choice from multiple patterns) */
export type IInterpreterSymbolDef<V, C> = IInterpreterPattern<V, C>[];

/** All the information to define an interpreter, with return type V */
export type IInterpreter<V, C> = {
    tokenizer: {[symbol: string]: IInterpreterTokenDef<V, C>};
    grammar: {[symbol: string]: IInterpreterSymbolDef<V, C>};
};

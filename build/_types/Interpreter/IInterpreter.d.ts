import { ISymbol } from "../CNF/ICNF";
export declare type IInterpreterTokenDef<V> = {
    match: RegExp | string;
    eval: (text: string, match: RegExpExecArray) => V;
} | RegExp | string;
/** A pattern definition, including the function to execute with the pattern */
export declare type IInterpreterPattern<V> = {
    parts: ISymbol[];
    eval: (...parts: V[]) => V;
};
/** A symbol definition (choice from multiple patterns) */
export declare type IInterpreterSymbolDef<V> = IInterpreterPattern<V>[];
/** All the information to define an interpreter, with return type V */
export declare type IInterpreter<V> = {
    tokenizer: {
        [symbol: string]: IInterpreterTokenDef<V>;
    };
    grammar: {
        [symbol: string]: IInterpreterSymbolDef<V>;
    };
};

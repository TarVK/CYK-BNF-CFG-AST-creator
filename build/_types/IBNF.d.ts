/** A syntax symbol */
declare type Symbol = string;
/** A sequence of symbols */
declare type Pattern = {
    /** The sequence of symbols of this pattern */
    parts: (Symbol | {
        [name: string]: Symbol;
    })[];
    /** Whether to perform left or right recursion given a left and right recursive pattern*/
    rightRecursive?: boolean;
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
};
/** A Symbol definition */
declare type SymbolDef = Pattern[] | {
    /** The patterns to chose from for a symbol */
    options: Pattern[];
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
} | Pattern;
/** A complete BNF grammar */
export declare type IBNF = {
    [symbol: string]: SymbolDef;
};
export {};

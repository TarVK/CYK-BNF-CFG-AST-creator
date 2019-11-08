/** A syntax symbol */
declare type Symbol = string;
/** A sequence of symbols */
declare type Pattern = {
    /** The left symbol of the pattern */
    left: Symbol;
    /** The right symbol of the pattern */
    right: Symbol;
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
};
/** A Symbol definition */
declare type SymbolDef = Pattern[] | {
    /** The patterns to chose from for a symbol */
    options: Pattern[];
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
};
/** A complete CNF grammar */
export declare type ICNF = {
    [symbol: string]: SymbolDef;
};
export {};

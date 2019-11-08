/** A syntax symbol */
type Symbol = string;

/** A sequence of symbols */
type Pattern = {
    /** The sequence of symbols of this pattern */
    parts: (Symbol | {[name: string]: Symbol})[];
    /** Whether to perform left or right recursion given a left and right recursive pattern*/
    rightRecursive?: boolean;
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
};

/** A Symbol definition */
type SymbolDef =
    | Pattern[]
    | {
          /** The patterns to chose from for a symbol */
          options: Pattern[];
          /** Any contextual data you want to attach to the resulting AST */
          metaData?: any;
      }
    | Pattern;

/** A complete BNF grammar */
export type IBNF = {[symbol: string]: SymbolDef};

/** A syntax symbol */
type Symbol = string;

/** A sequence of symbols */
export type ICFGpattern = {
    /** The sequence of symbols of this pattern */
    parts: (Symbol | {[name: string]: Symbol})[];
    /** Whether to perform left or right recursion given a left and right recursive pattern*/
    rightRecursive?: boolean;
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
};

/** A Symbol definition */
export type ICFGsymbolDef =
    | ICFGpattern[]
    | {
          /** The patterns to chose from for a symbol */
          options: ICFGpattern[];
          /** Any contextual data you want to attach to the resulting AST */
          metaData?: any;
      }
    | ICFGpattern;

/** A complete BNF grammar */
export type ICFG = {[symbol: string]: ICFGsymbolDef};

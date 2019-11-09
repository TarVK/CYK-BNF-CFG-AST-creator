/** A syntax symbol */
declare type Symbol = string;
/** A sequence of symbols */
export declare type ICFGpattern = {
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
export declare type ICFGsymbolDef = ICFGpattern[] | {
    /** The patterns to chose from for a symbol */
    options: ICFGpattern[];
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
} | ICFGpattern;
/** A complete BNF grammar */
export declare type ICFG = {
    [symbol: string]: ICFGsymbolDef;
};
export {};

/** A syntax symbol */
declare type Symbol = string;
/** A sequence of symbols */
export declare type ICFGpattern = {
    /** The sequence of symbols of this pattern */
    parts: Symbol[];
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
};
/** A Symbol definition */
export declare type ICFGsymbolDef = ICFGpattern[];
/** A complete BNF grammar */
export declare type ICFG = {
    [symbol: string]: ICFGsymbolDef;
};
export {};

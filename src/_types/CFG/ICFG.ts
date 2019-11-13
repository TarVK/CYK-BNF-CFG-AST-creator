/** A syntax symbol */
type Symbol = string;

/** A sequence of symbols */
export type ICFGpattern = {
    /** The sequence of symbols of this pattern */
    parts: Symbol[];
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
};

/** A Symbol definition */
export type ICFGsymbolDef = ICFGpattern[];

/** A complete BNF grammar */
export type ICFG = {[symbol: string]: ICFGsymbolDef};

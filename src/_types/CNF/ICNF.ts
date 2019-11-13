/** A syntax symbol */
export type ISymbol = string;

/** A sequence of symbols */
export type ICNFpattern = {
    /** The left symbol of the pattern */
    left: ISymbol;
    /** The right symbol of the pattern */
    right: ISymbol;
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
};

/** A Symbol definition */
export type ICNFsymbolDef = ICNFpattern[];

/** A complete CNF grammar */
export type ICNF = {[symbol: string]: ICNFsymbolDef};

/** A syntax symbol */
export declare type ISymbol = string;
/** A sequence of symbols */
export declare type ICNFpattern = {
    /** The left symbol of the pattern */
    left: ISymbol;
    /** The right symbol of the pattern */
    right: ISymbol;
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
};
/** A Symbol definition */
export declare type ICNFsymbolDef = ICNFpattern[];
/** A complete CNF grammar */
export declare type ICNF = {
    [symbol: string]: ICNFsymbolDef;
};

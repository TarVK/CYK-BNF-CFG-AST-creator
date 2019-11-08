/** A syntax symbol */
export type Isymbol = string;

/** A sequence of symbols */
export type ICNFpattern = {
    /** The left symbol of the pattern */
    left: Isymbol;
    /** The right symbol of the pattern */
    right: Isymbol;
    /** Any contextual data you want to attach to the resulting AST */
    metaData?: any;
};

/** A Symbol definition */
export type ICNFsymbolDef =
    | ICNFpattern[]
    | {
          /** The patterns to chose from for a symbol */
          options: ICNFpattern[];
          /** Any contextual data you want to attach to the resulting AST */
          metaData?: any;
      };

/** A complete CNF grammar */
export type ICNF = {[symbol: string]: ICNFsymbolDef};

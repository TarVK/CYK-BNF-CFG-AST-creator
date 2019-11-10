import {ICFGsymbolDef, ICFGpattern} from "./ICFG";
import {ISymbol} from "../CNF/ICNF";

export type ICFGpatternNormalizedMetaData = {
    orPattern?: ICFGpattern & {
        /** The symbol that defines this pattern as an option */
        defSymbol: string;
    };
    /** Stores 'parent' data of unit rules */
    parent?: ICFGpatternNormalizedMetaData;
};

/** A sequence of symbols */
export type ICFGpatternNormalized = {
    /** The sequence of symbols of this pattern */
    parts: ISymbol[];
    /** Whether to perform left or right recursion given a left and right recursive pattern*/
    rightRecursive?: boolean;
    /** Contextual data linking to the original pattern */
    metaData?: ICFGpatternNormalizedMetaData;
};

/** A Symbol definition */
export type ICFGsymbolDefNormalized = ICFGpatternNormalized[];

/** A complete BNF grammar */
export type ICFGnormalized = {[symbol: string]: ICFGsymbolDefNormalized};

/*

A ::= B:1
B ::= C:2
C ::= "t":3

A ::= "t":3:2:1
B ::= "t":3:2
C ::= "t":3

 */

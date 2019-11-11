import { ICFGpattern } from "./ICFG";
import { ISymbol } from "../CNF/ICNF";
export declare type ICFGpatternNormalizedMetaData = {
    orPattern?: ICFGpattern & {
        /** The symbol that defines this pattern as an option */
        defSymbol: string;
    };
    /** Stores 'parent' data of unit rules */
    parent?: ICFGpatternNormalizedMetaData;
};
/** A sequence of symbols */
export declare type ICFGpatternNormalized = {
    /** The sequence of symbols of this pattern */
    parts: ISymbol[];
    /** Whether to perform left or right recursion given a left and right recursive pattern*/
    rightRecursive?: boolean;
    /** Contextual data linking to the original pattern */
    metaData?: ICFGpatternNormalizedMetaData;
};
/** A Symbol definition */
export declare type ICFGsymbolDefNormalized = ICFGpatternNormalized[];
/** A complete BNF grammar */
export declare type ICFGnormalized = {
    [symbol: string]: ICFGsymbolDefNormalized;
};

import { ICFGpattern } from "./ICFG";
import { ISymbol } from "../CNF/ICNF";
export declare type ICFGpatternNormalizedMetaData = {
    orPattern?: ICFGpattern & {
        /** The symbol that defines this pattern as an option */
        defSymbol: string;
    };
    /** Retains data removed by BIN operations, stores whether or not the left child contains multiple children of the same pattern */
    leftRecursive?: boolean;
    /** Retains data removed by DEL operations, store the left pattern that could result in an empty string */
    leftEmpty?: ICFGpatternNormalizedMetaData;
    /** Retains data removed by DEL operations, store the right pattern that could result in an empty string */
    rightEmpty?: ICFGpatternNormalizedMetaData;
    /** Retains data removed by UNIT operations, stores the 'parent' pattern*/
    parent?: ICFGpatternNormalizedMetaData;
};
/** A sequence of symbols */
export declare type ICFGpatternNormalized = {
    /** The sequence of symbols of this pattern */
    parts: ISymbol[];
    /** Contextual data linking to the original pattern */
    metaData?: ICFGpatternNormalizedMetaData;
};
/** A Symbol definition */
export declare type ICFGsymbolDefNormalized = ICFGpatternNormalized[];
/** A complete BNF grammar */
export declare type ICFGnormalized = {
    [symbol: string]: ICFGsymbolDefNormalized;
};

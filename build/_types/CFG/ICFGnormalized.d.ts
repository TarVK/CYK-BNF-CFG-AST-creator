import { ICFGpattern } from "./ICFG";
/** A syntax symbol */
declare type Symbol = string;
/** A sequence of symbols */
export declare type ICFGpatternNormalized = {
    /** The sequence of symbols of this pattern */
    parts: Symbol[];
    /** Whether to perform left or right recursion given a left and right recursive pattern*/
    rightRecursive?: boolean;
    /** Contextual data linking to the original pattern */
    metaData?: {
        pattern?: ICFGpattern;
    };
};
/** A Symbol definition */
export declare type ICFGsymbolDefNormalized = ICFGpatternNormalized[];
/** A complete BNF grammar */
export declare type ICFGnormalized = {
    [symbol: string]: ICFGsymbolDefNormalized;
};
export {};

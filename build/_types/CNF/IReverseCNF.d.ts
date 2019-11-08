/** A syntax symbol */
declare type Symbol = string;
/** A sequence of symbols */
declare type Pattern = {
    left: Symbol;
    right: Symbol;
    defSymbol: Symbol;
    metaData?: any;
};
/** A complete CNF grammar */
export declare type IReverseCNF = {
    [symbol: string]: {
        [symbol: string]: Pattern[];
    };
};
export {};

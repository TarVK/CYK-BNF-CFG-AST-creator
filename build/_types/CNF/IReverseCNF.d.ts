import { ISymbol } from "./ICNF";
/** A sequence of symbols */
export declare type ICNFnamedPattern = {
    left: ISymbol;
    right: ISymbol;
    defSymbol: ISymbol;
    metaData?: any;
};
/** A complete CNF grammar */
export declare type IReverseCNF = {
    [symbol: string]: {
        [symbol: string]: ICNFnamedPattern[];
    };
};

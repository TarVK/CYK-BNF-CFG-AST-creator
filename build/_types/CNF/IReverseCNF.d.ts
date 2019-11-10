import { ISymbol, ICNFpattern } from "./ICNF";
/** A sequence of symbols */
export declare type ICNFnamedPattern = {
    defSymbol: ISymbol;
} & ICNFpattern;
/** A complete CNF grammar */
export declare type IReverseCNF = {
    [symbol: string]: {
        [symbol: string]: ICNFnamedPattern[];
    };
};

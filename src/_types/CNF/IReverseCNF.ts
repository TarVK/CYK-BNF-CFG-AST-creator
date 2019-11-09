import {ISymbol, ICNFpattern} from "./ICNF";

/** A sequence of symbols */
export type ICNFnamedPattern = {
    defSymbol: ISymbol;
} & ICNFpattern;

/** A complete CNF grammar */
export type IReverseCNF = {[symbol: string]: {[symbol: string]: ICNFnamedPattern[]}};

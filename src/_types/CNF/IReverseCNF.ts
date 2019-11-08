import {Isymbol} from "./ICNF";

/** A sequence of symbols */
export type ICNFnamedPattern = {
    left: Isymbol;
    right: Isymbol;
    defSymbol: Isymbol;
    metaData?: any;
};

/** A complete CNF grammar */
export type IReverseCNF = {[symbol: string]: {[symbol: string]: ICNFnamedPattern[]}};

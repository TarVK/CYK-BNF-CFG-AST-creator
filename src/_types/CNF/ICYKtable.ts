import {ISymbol} from "./ICNF";
import {ICNFnamedPattern} from "./IReverseCNF";

/** The cell to be filled for the table */
export type ICYKcell = {
    symbols: ISymbol[];
    definitions: ({index: number} & ICNFnamedPattern)[];
    range: {
        start: number;
        end: number;
    };
};

/** Defines the table to be filled using CYK */
export type ICYKtable = ICYKcell[][];

import {Isymbol} from "./ICNF";
import {ICNFnamedPattern} from "./IReverseCNF";

/** The cell to be filled for the table */
export type ICYKcell = {
    symbols: Isymbol[];
    definitions: ({index: number} & ICNFnamedPattern)[];
};

/** Defines the table to be filled using CYK */
export type ICYKtable = ICYKcell[][];

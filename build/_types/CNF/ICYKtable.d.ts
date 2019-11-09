import { ISymbol } from "./ICNF";
import { ICNFnamedPattern } from "./IReverseCNF";
/** The cell to be filled for the table */
export declare type ICYKcell = {
    symbols: ISymbol[];
    definitions: ({
        index: number;
    } & ICNFnamedPattern)[];
    range: {
        start: number;
        end: number;
    };
};
/** Defines the table to be filled using CYK */
export declare type ICYKtable = ICYKcell[][];

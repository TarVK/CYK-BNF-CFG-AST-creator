import { ICYKtable } from "./ICYKtable";
export declare type ICNFerror = {
    error: true;
    /** The  CYK table containing match information */
    table: ICYKtable;
};

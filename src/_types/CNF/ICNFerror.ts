import {ICYKtable} from "./ICYKtable";

export type ICNFerror = {
    error: true;
    /** The  CYK table containing match information */
    table: ICYKtable;
};

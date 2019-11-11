import { ICYKcell } from "./ICYKtable";
import { ICNFtree } from "./ICNFtree";
import { ICNFnamedPattern } from "./IReverseCNF";
import { ISymbol } from "./ICNF";
export declare type ICNFstackItem = {
    cell: ICYKcell;
    index: [number, number];
    symbol: ISymbol;
    pattern: ICNFnamedPattern;
    node: ICNFtree;
    left: ICNFstackItem;
    right: ICNFstackItem;
};

import { ICYKcell } from "./ICYKtable";
import { ICNFtree } from "./ICNFtree";
import { ICNFnamedPattern } from "./IReverseCNF";
export declare type ICNFstackItem = {
    cell: ICYKcell;
    index: [number, number];
    pattern: ICNFnamedPattern;
    node: ICNFtree;
    left: ICNFstackItem;
    right: ICNFstackItem;
};

import {ICNFtree} from "../CNF/ICNFtree";
import {ICFGtree} from "./ICFGtree";

export type ICFGstackItem = {
    node: ICFGtree;
    cnfNode: ICNFtree;
    left: ICFGstackItem;
    right: ICFGstackItem;
};

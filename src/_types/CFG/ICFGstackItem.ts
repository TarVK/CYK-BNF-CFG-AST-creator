import {ICNFtree} from "../CNF/ICNFtree";
import {ICFGtree} from "./ICFGtree";
import {ICFGpatternNormalizedMetaData} from "./ICFGnormalized";

export type ICFGstackItem = {
    node?: ICFGtree;
    cnfNode: ICNFtree;
    metaData: ICFGpatternNormalizedMetaData;
    range: {start: number; end: number};
    children: ICFGstackItem[];
    initialized: boolean;
};

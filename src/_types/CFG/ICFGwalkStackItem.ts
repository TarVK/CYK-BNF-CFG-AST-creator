import {ICFGtree} from "./ICFGtree";

/**
 * Data to be used in the stack to walk a tree
 */
export type ICFGwalkStackItem<V> = {
    node: ICFGtree;
    result: V;
    children: ICFGwalkStackItem<V>[];
};

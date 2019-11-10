import { ICFGtree } from "./ICFGtree";
/**
 * Data to be used in the stack to walk a tree
 */
export declare type ICFGwalkStackItem<V> = {
    node: ICFGtree;
    result: V;
    children: ICFGwalkStackItem<V>[];
};

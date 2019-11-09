import { ISymbol } from "../CNF/ICNF";
import { ICFGpattern } from "./ICFG";
export declare type ICFGtree = {
    /** The symbol that this node represents */
    symbol: ISymbol;
    /** The pattern that this node was created from */
    pattern: ICFGpattern;
    /** The children of this node */
    children: {
        [name: string]: ICFGtree;
    };
    /** The range of the input that this node covers */
    range: {
        start: number;
        end: number;
    };
    /** The text this node represents */
    text: string;
} | {
    /** The symbol that this node represents */
    symbol: ISymbol;
    /** The range of the input that this node covers */
    range: {
        start: number;
        end: number;
    };
    /** The text this node represents */
    text: string;
};

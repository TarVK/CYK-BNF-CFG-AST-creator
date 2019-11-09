import { ICNFpattern, ISymbol } from "./ICNF";
export declare type ICNFtree = {
    /** The symbol that this node represents */
    symbol: ISymbol;
    /** The pattern that this node was created from */
    pattern: ICNFpattern;
    /** The left subtree */
    left: ICNFtree;
    /** The right subtree */
    right: ICNFtree;
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

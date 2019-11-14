import { ICNF } from "./_types/CNF/ICNF";
import { IReverseCNF } from "./_types/CNF/IReverseCNF";
import { ICYKtable } from "./_types/CNF/ICYKtable";
import { ICNFtree } from "./_types/CNF/ICNFtree";
import { ITokenized } from "./_types/Tokenizer/ITokenized";
import { ICNFerror } from "./_types/CNF/ICNFerror";
/**
 * A class to represent a CNF grammar, and allows for creation of a binary tree from a token array
 */
export declare class CNF {
    protected grammar: ICNF;
    protected startSymbol: string;
    protected lookupTable: IReverseCNF;
    /**
     * Creates a new instance
     * @param grammar The grammmar to create an instance for
     * @param startSymbol The symbol that a matched string should have
     */
    constructor(grammar: ICNF, startSymbol: string);
    /**
     * Creates a lookup table for the grammar
     * @param grammar The grammar to create a lookup table for
     * @returns The lookup table for a given grammar
     */
    protected createLookupTable(grammar: ICNF): IReverseCNF;
    /**
     * Creates a CYk table given an input string
     * @param input The input tokens
     * @param approximate Whether to allow changing a right token to improve the match
     * @returns The table
     */
    performCYK(input: ITokenized, approximate?: boolean): ICYKtable;
    /**
     * Retrieves the binary tree of some input
     * @param input The input to construct a tree for
     * @returns The tree
     */
    createBinaryTree(input: ITokenized): ICNFtree | ICNFerror;
}

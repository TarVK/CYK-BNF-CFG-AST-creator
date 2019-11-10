import { CNF } from "./CNF";
import { ICFG } from "./_types/CFG/ICFG";
import { ICFGnormalized } from "./_types/CFG/ICFGnormalized";
import { ITokenized } from "./_types/Tokenizer/ITokenized";
import { ICFGtree } from "./_types/CFG/ICFGtree";
import { ICNFerror } from "./_types/CNF/ICNFerror";
/**
 * A class that can be used to create an arbitrary Context Free Grammar, and allows for creation of an AST tree according to said grammar
 */
export declare class CFG {
    protected grammar: ICFG;
    protected startSymbol: string;
    protected CNF: CNF;
    /**
     * Creates a new instance
     * @param grammar The grammmar to create an instance for
     * @param startSymbol The symbol that a matched string should have
     */
    constructor(grammar: ICFG, startSymbol: string);
    /**
     * Creates a CNF grammar representing the given BNF grammar
     * @param grammar The base BNF grammar
     * @param startSymbol The start symbol
     * @returns The CNF grammar representing the BNF grammar
     */
    protected createCNF(grammar: ICFG, startSymbol: string): CNF;
    /**
     * Deep copies and normalizes the given grammar, also transforms the metadata
     * @param grammar The grammar to copy
     * @returns A copy of the grammar
     */
    protected copyCFG(grammar: ICFG): ICFGnormalized;
    /**
     * Creates a AST tree from a given input of lexical tokens
     * @param input The input
     * @returns The resulting tree or an error
     */
    createASTtree(input: ITokenized): ICFGtree | ICNFerror;
    /**
     * Walks a given tree, and calls the reduce function on every node
     * @param tree The tree to be walked
     * @param reduce The reduce function to invoke on every node
     * @returns The value returned by the reduce method on the root node
     */
    static walkTree<V>(tree: ICFGtree, reduce: (node: ICFGtree, childVals: V[]) => V): V;
}

import { CNF } from "./CNF";
import { ICFG, ICFGpattern } from "./_types/CFG/ICFG";
import { ICFGnormalized, ICFGpatternNormalized } from "./_types/CFG/ICFGnormalized";
import { ITokenized } from "./_types/Tokenizer/ITokenized";
import { ICFGtree } from "./_types/CFG/ICFGtree";
import { ICNFerror } from "./_types/CNF/ICNFerror";
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
     * Deep copies and normalizes the given pattern
     * @param pattern The pattern to copy
     * @param definition The definiition that this pattern was part of
     * @returns A copy of the pattern
     */
    protected copyPattern(pattern: ICFGpattern): ICFGpatternNormalized;
    /**
     * Creates a AST tree from a given input of lexical tokens
     * @param input The input
     */
    createASTtree(input: ITokenized): ICFGtree | ICNFerror;
}

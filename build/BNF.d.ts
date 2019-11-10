import { Interpreter } from "./Interpreter";
import { ITokenizer } from "./_types/Tokenizer/ITokenizer";
import { ICFG } from "./_types/CFG/ICFG";
import { CFG } from "./CFG";
import { Tokenizer } from "./Tokenizer";
import { ICNFerror } from "./_types/CNF/ICNFerror";
import { ITokenizeError } from "./_types/Tokenizer/ITokenizeError";
import { ICFGtree } from "./_types/CFG/ICFGtree";
/**
 * An interpreter to read the BNF language and output grammar and tokizer data accordingly
 */
export declare const BNFinterpreter: Interpreter<any, {
    tokenizer: ITokenizer;
    grammar: ICFG;
}>;
export declare class BNF {
    protected grammar: string;
    protected CFG: CFG;
    protected tokenizer: Tokenizer;
    /**
     * Creates a grammar based on a passed BNF syntax
     * @param grammar The grammar to create
     */
    constructor(grammar: string);
    /**
     * Creates a CFG and tokenizer from the given BNF string
     * @param grammar The BNF input grammar
     * @returns The resulting tokenizer and CFG, or an error
     */
    protected createTokenizerAndCFG(grammar: string): {
        grammar: CFG;
        tokenizer: Tokenizer;
    } | ICNFerror | ITokenizeError;
    /**
     * Creates an AST tree for the given input string
     * @param input The input string
     * @returns An AST tree if the input conforms to the grammar, or an error otherwise
     */
    createASTtree(input: string): ICFGtree | ICNFerror | ITokenizeError;
}

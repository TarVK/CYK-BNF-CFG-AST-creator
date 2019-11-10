import { IInterpreter } from "./_types/Interpreter/IInterpreter";
import { ICNFerror } from "./_types/CNF/ICNFerror";
import { ITokenizeError } from "./_types/Tokenizer/ITokenizeError";
import { CFG } from "./CFG";
import { Tokenizer } from "./Tokenizer";
/**
 * A class that can be used to create an interpreter
 */
export declare class Interpreter<V, C> {
    protected interpreter: IInterpreter<V, C>;
    protected startSymbol: string;
    protected tokenizer: Tokenizer;
    protected grammar: CFG;
    constructor(interpreter: IInterpreter<V, C>, startSymbol: string);
    /**
     * Constructs a CFG from the given interpreter definition
     * @param interpreter The interpreter definition
     * @param startSymbol The stary symbol
     * @returns The resulting CFG that has metadata that can be used for evaluation
     */
    protected createCFG(interpreter: IInterpreter<V, C>, startSymbol: string): CFG;
    /**
     * Constructs a tokenizer form the given interpreter definition
     * @param interpreter The interpreter definition
     * @returns The resulting tokenizer
     */
    protected createTokenizer(interpreter: IInterpreter<V, C>): Tokenizer;
    /**
     * Evaluates a given input string, and returns an error or the result
     * @param input The input string
     * @param context The context to pass to evaluators
     * @returns The result
     */
    evaluate(input: string, context: C): ICNFerror | ITokenizeError | V;
}

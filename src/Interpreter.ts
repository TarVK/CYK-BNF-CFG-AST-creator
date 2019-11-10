import {IInterpreter} from "./_types/Interpreter/IInterpreter";
import {ICNFerror} from "./_types/CNF/ICNFerror";
import {ITokenizeError} from "./_types/Tokenizer/ITokenizeError";
import {CFG} from "./CFG";
import {Tokenizer} from "./Tokenizer";

/**
 * A class that can be used to create an interpreter
 */
export class Interpreter<V, C> {
    // The original interpreter data
    protected interpreter: IInterpreter<V, C>;

    // The original start symbol
    protected startSymbol: string;

    // The derived tokenizer
    protected tokenizer: Tokenizer;

    // The derived CFG
    protected grammar: CFG;

    constructor(interpreter: IInterpreter<V, C>, startSymbol: string) {
        this.interpreter = interpreter;
        this.startSymbol = startSymbol;
        this.grammar = this.createCFG(interpreter, startSymbol);
        this.tokenizer = this.createTokenizer(interpreter);
    }

    /**
     * Constructs a CFG from the given interpreter definition
     * @param interpreter The interpreter definition
     * @param startSymbol The stary symbol
     * @returns The resulting CFG that has metadata that can be used for evaluation
     */
    protected createCFG(interpreter: IInterpreter<V, C>, startSymbol: string): CFG {
        const cfg = {};

        // Create a valid CFG by storing the eval function as metadata for every pattern
        Object.keys(interpreter.grammar).forEach(symbol => {
            const options = interpreter.grammar[symbol];
            cfg[symbol] = options.map(pattern => ({
                parts: pattern.parts,
                metaData: {eval: pattern.eval},
            }));
        });

        return new CFG(cfg, startSymbol);
    }

    /**
     * Constructs a tokenizer form the given interpreter definition
     * @param interpreter The interpreter definition
     * @returns The resulting tokenizer
     */
    protected createTokenizer(interpreter: IInterpreter<V, C>): Tokenizer {
        const tokenizer = {};

        // Map the tokenizre object values to rege only
        Object.keys(interpreter.tokenizer).forEach(symbol => {
            const def = interpreter.tokenizer[symbol];
            tokenizer[symbol] =
                typeof def == "string" ? def : "match" in def ? def.match : def;
        });

        return new Tokenizer(tokenizer);
    }

    /**
     * Evaluates a given input string, and returns an error or the result
     * @param input The input string
     * @param context The context to pass to evaluators
     * @returns The result
     */
    public evaluate(input: string, context: C): ICNFerror | ITokenizeError | V {
        // Tokenize the input
        const tokens = this.tokenizer.tokenize(input);
        if ("error" in tokens) return tokens;

        // Create a tree out of the tokens
        const tree = this.grammar.createASTtree(tokens);
        if ("error" in tree) return tree;

        // Walk the tree and invoke the evaluation functions
        return CFG.walkTree(tree, (node, children) => {
            // Check whether this is a base token, or other symbol
            if (!("children" in node)) {
                const def = this.interpreter.tokenizer[node.symbol];
                return typeof def != "string" && "eval" in def
                    ? def.eval(
                          node.text,
                          def.match instanceof RegExp && def.match.exec(node.text),
                          context
                      )
                    : node.text;
            } else {
                return node.pattern.metaData.eval(children, context);
            }
        });
    }
}

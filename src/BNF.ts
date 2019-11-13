import {Interpreter} from "./Interpreter";
import {ITokenizer} from "./_types/Tokenizer/ITokenizer";
import {ICFG} from "./_types/CFG/ICFG";
import {isContext} from "vm";
import {CFG} from "./CFG";
import {Tokenizer} from "./Tokenizer";
import {ICNFerror} from "./_types/CNF/ICNFerror";
import {ITokenizeError} from "./_types/Tokenizer/ITokenizeError";
import {ICFGtree} from "./_types/CFG/ICFGtree";

/**
 * Creates a symbol from some given text
 */
const c = text => `'${text}'`;
const w = text => `"${text}"`;

/**
 * An interpreter to read the BNF language and output grammar and tokizer data accordingly
 */
export const BNFinterpreter = new Interpreter<
    any,
    {tokenizer: ITokenizer; grammar: ICFG}
>(
    {
        tokenizer: {
            sym: {match: /\s*\<([a-zA-Z0-9\-]+)\>\s*/, eval: (text, match) => match[1]},
            assign: /\s*::=\s*/,
            or: /\s*\|\s*/,
            text: {
                match: /"(([\\\\]|\\"|[^\\"])*)"|'(([\\\\]|\\'|[^\\'])*)'/,
                eval: (text, match) =>
                    (match[1] || match[3] || "")
                        .replace(/\\"/, '"')
                        .replace(/\\'/, "'")
                        .replace(/\\\\/, "\\"),
            },
            eol: /\s*\r*\n|$/,
        },
        grammar: {
            GRAMMAR: [
                {
                    parts: ["GRAMMAR", "LINE"],
                    eval: ([v]) => v,
                },
                {
                    parts: ["LINE"],
                    eval: ([sym], context) => ({startSymbol: sym, ...context}),
                },
            ],
            LINE: [
                {
                    parts: ["sym", "assign", "DEF"],
                    eval: ([sym, , def], context) => {
                        context.grammar[sym] = def;
                        return sym;
                    },
                },
                {parts: ["LINE", "eol"], eval: ([sym]) => sym},
                {parts: ["eol"], eval: v => v},
            ],
            DEF: [
                {
                    parts: ["DEF", "or", "SEQ"],
                    eval: ([def, , pattern]) => [...def, pattern],
                },
                {parts: ["SEQ"], eval: ([pattern]) => [pattern]},
            ],
            SEQ: [
                {
                    parts: ["SEQ", "MATCH"],
                    eval: ([seq, sym]) => ({parts: [...seq.parts, sym]}),
                },
                {parts: ["MATCH"], eval: ([sym]) => ({parts: [sym]})},
            ],
            MATCH: [
                {
                    parts: ["text"],
                    eval: ([v], context) => {
                        const symbol = w(v);
                        const chars = v.split("");
                        // Create a terminal token for each character
                        chars.forEach(char => {
                            context.tokenizer[c(char)] = char;
                        });

                        // Create a symbol that matches this token sequence
                        context.grammar[symbol] = [
                            {
                                parts: chars.map(char => c(char)),
                                metaData: "word",
                            },
                        ];
                        return symbol;
                    },
                },
                {
                    parts: ["sym"],
                    eval: ([v], context) => {
                        if (v.toLowerCase() == "eol") context.tokenizer[v] = /\r*\n|$/;
                        return v;
                    },
                },
            ],
        },
    },
    "GRAMMAR"
);

export class BNF {
    // The BNF grammar
    protected grammar: string;

    // The derived CFG instance
    protected CFG: CFG;

    // A derived tokenizer instance
    protected tokenizer: Tokenizer;

    /**
     * Creates a grammar based on a passed BNF syntax
     * @param grammar The grammar to create
     */
    constructor(grammar: string) {
        const result = this.createTokenizerAndCFG(grammar);
        if ("error" in result)
            if ("index" in result) throw Error(`Syntax error at index ${result.index}`);
            else throw Error(`Syntax error`);

        this.CFG = result.grammar;
        this.tokenizer = result.tokenizer;
    }

    /**
     * Creates a CFG and tokenizer from the given BNF string
     * @param grammar The BNF input grammar
     * @returns The resulting tokenizer and CFG, or an error
     */
    protected createTokenizerAndCFG(
        grammar: string
    ): {grammar: CFG; tokenizer: Tokenizer} | ICNFerror | ITokenizeError {
        const result = BNFinterpreter.evaluate(grammar, {
            tokenizer: {},
            grammar: {},
        });
        if ("error" in result) return result;

        return {
            grammar: new CFG(result.grammar, result.startSymbol),
            tokenizer: new Tokenizer(result.tokenizer),
        };
    }

    /**
     * Creates an AST tree for the given input string
     * @param input The input string
     * @returns An AST tree if the input conforms to the grammar, or an error otherwise
     */
    public createASTtree(input: string): ICFGtree | ICNFerror | ITokenizeError {
        // Tokenize the input
        const tokens = this.tokenizer.tokenize(input);
        if ("error" in tokens) return tokens;

        // Create a tree out of the tokens
        const tree = this.CFG.createASTtree(tokens);
        if ("error" in tree) return tree;

        // Cleanup terminal nodes
        CFG.walkTree(tree, node => {
            if ("children" in node && node.pattern.metaData == "word") {
                delete node.children;
                delete node.pattern;
            }
        });
        return tree;
    }
}

import {CNF} from "./CNF";

import {ICFG, ICFGpattern, ICFGsymbolDef} from "./_types/CFG/ICFG";
import {ICFGnormalized, ICFGpatternNormalized} from "./_types/CFG/ICFGnormalized";
import {ITokenized} from "./_types/Tokenizer/ITokenized";
import {ICFGtree} from "./_types/CFG/ICFGtree";
import {ICFGstackItem} from "./_types/CFG/ICFGstackItem";
import {ICNFerror} from "./_types/CNF/ICNFerror";
import {ICNFtree} from "./_types/CNF/ICNFtree";

let s = 0;
/** Generates a new symbol */
const g = () => s++ + "";

export class CFG {
    // The grammar
    protected grammar: ICFG;

    // The symbol that the matched input should have as a whole
    protected startSymbol: string;

    // The CNF form of this CFG
    protected CNF: CNF;

    /**
     * Creates a new instance
     * @param grammar The grammmar to create an instance for
     * @param startSymbol The symbol that a matched string should have
     */
    constructor(grammar: ICFG, startSymbol: string) {
        this.grammar = grammar;
        this.startSymbol = startSymbol;
        this.CNF = this.createCNF(grammar, startSymbol);
    }

    /**
     * Creates a CNF grammar representing the given BNF grammar
     * @param grammar The base BNF grammar
     * @param startSymbol The start symbol
     * @returns The CNF grammar representing the BNF grammar
     */
    protected createCNF(grammar: ICFG, startSymbol: string): CNF {
        const cfg: ICFGnormalized = this.copyCFG(grammar);

        // Conversion as described in  https://en.wikipedia.org/wiki/Chomsky_normal_form#Converting_a_grammar_to_Chomsky_normal_form
        // Some steps that don't apply to our representation are skipped

        // BIN
        const symbols = Object.keys(cfg);
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            const options = cfg[symbol];

            // Split all patterns with more than 2 parts
            cfg[symbol] = options.map(pattern => {
                if (pattern.parts.length > 2) {
                    const newSymbol = g();
                    cfg[newSymbol] = [
                        {
                            ...pattern,
                            metaData: {
                                ...pattern.metaData,
                                partNames: pattern.metaData.partNames.slice(
                                    0,
                                    pattern.parts.length - 1
                                ),
                            },
                            parts: pattern.parts.slice(0, pattern.parts.length - 1),
                        },
                    ];
                    symbols.push(newSymbol);
                    return {
                        ...pattern,
                        metaData: {
                            ...pattern.metaData,
                            partNames: [
                                newSymbol,
                                pattern.metaData.partNames[pattern.parts.length - 1],
                            ],
                        },
                        parts: [newSymbol, pattern.parts[pattern.parts.length - 1]],
                    };
                }
                return pattern;
            });
        }

        // UNIT
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            const options = cfg[symbol];

            for (let j = 0; j < options.length && j < 1e4; j++) {
                const pattern = options[j];
                if (pattern.parts.length == 1) {
                    // Add the definitions of the part
                    const [part] = pattern.parts;
                    const copyOptions = cfg[part];
                    // Make sure this isn't a terminale symbol
                    if (copyOptions) {
                        copyOptions.forEach(option => options.push(option));

                        // Remove the option
                        options.splice(j, 1);
                        j--;
                    }
                }
            }
        }

        // Convert the grammar to CNF
        const cnf = {};
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            const options = cfg[symbol];

            cnf[symbol] = options.map(pattern => ({
                left: pattern.parts[0],
                right: pattern.parts[1],
                metaData: pattern.metaData,
                ...(pattern.rightRecursive && {rightRecursive: pattern.rightRecursive}),
            }));
        }
        return new CNF(cnf, startSymbol);
    }

    /**
     * Deep copies and normalizes the given grammar, also transforms the metadata
     * @param grammar The grammar to copy
     * @returns A copy of the grammar
     */
    protected copyCFG(grammar: ICFG): ICFGnormalized {
        const cfg = {};
        Object.keys(grammar).forEach(symbol => {
            const def = grammar[symbol];

            // Normalize the options format
            let options;
            if (def instanceof Array) {
                options = def.map(pattern => this.copyPattern(pattern));
            } else if ("options" in def) {
                options = def.options.map(pattern => this.copyPattern(pattern));
            } else {
                options = [this.copyPattern(def)];
            }

            // Store the definition with the original definition as metadata
            cfg[symbol] = options;
        });
        return cfg;
    }

    /**
     * Deep copies and normalizes the given pattern
     * @param pattern The pattern to copy
     * @param definition The definiition that this pattern was part of
     * @returns A copy of the pattern
     */
    protected copyPattern(pattern: ICFGpattern): ICFGpatternNormalized {
        return {
            rightRecursive: pattern.rightRecursive,
            metaData: {
                partNames: pattern.parts.map((part, i) =>
                    part instanceof Object ? Object.keys(part)[0] : i + ""
                ),
                pattern,
            },
            parts: pattern.parts.map((part, i) =>
                part instanceof Object ? part[Object.keys(part)[0]] : part
            ),
        };
    }

    /**
     * Creates a AST tree from a given input of lexical tokens
     * @param input The input
     */
    public createASTtree(input: ITokenized): ICFGtree | ICNFerror {
        // Parse the tree using CNF
        const binaryTree = this.CNF.getBinaryTree(input);
        if ("error" in binaryTree) return binaryTree;

        // Merge nodes to be in the same structure as the original CFG
        const c = (node: ICNFtree): ICFGstackItem => ({
            node: null,
            cnfNode: node,
            left: null,
            right: null,
        });
        const stack: ICFGstackItem[] = [c(binaryTree)];
        while (stack.length > 0) {
            const top = stack[stack.length - 1];
            const {cnfNode} = top;

            // Check whether this is a base token
            if (!("left" in cnfNode)) {
                stack.pop();
                top.node = cnfNode;
                if (stack.length == 0) return top.node;
            } else {
                // Check whether the item was just pushed to the stack, of all children were just popped
                if (!top.left) {
                    // Push the left and right children onto the stack
                    const left = (top.left = c(cnfNode.left));
                    const right = (top.right = c(cnfNode.right));
                    stack.push(left, right);
                } else {
                    // Pop the stack item and assemble the node using its children
                    stack.pop();
                    const childrenStack = [top.left, top.right];
                    const children = {};

                    // Handle both left and right children the same
                    for (let i = 0; i < 2; i++) {
                        const child = childrenStack[i];

                        // Check if the symbol is part of our grammar
                        if (
                            this.grammar[child.node.symbol] ||
                            !("children" in child.node)
                        ) {
                            // If so, just store the child under the given name
                            children[cnfNode.pattern.metaData.partNames[i]] = child.node;
                        } else {
                            // Otherwise, merge the childs children
                            Object.assign(children, child.node.children);
                        }
                    }

                    // Sort the children
                    const childList = Object.keys(children).map(name => children[name]);
                    childList.sort((a, b) => a.range.start - b.range.start);

                    // Assemble the node
                    const rs = childList[0].range.start;
                    const re = childList[childList.length - 1].range.end;
                    const text = childList.reduce((a, b) => a + b.text, "");
                    top.node = {
                        children,
                        range: {start: rs, end: re},
                        text,
                        pattern: cnfNode.pattern.metaData.pattern,
                        symbol: cnfNode.symbol,
                    };
                    if (stack.length == 0) return top.node;
                }
            }
        }
    }
}

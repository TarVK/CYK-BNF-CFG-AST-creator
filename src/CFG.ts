import {CNF} from "./CNF";

import {ICFG} from "./_types/CFG/ICFG";
import {ICFGnormalized} from "./_types/CFG/ICFGnormalized";
import {ITokenized} from "./_types/Tokenizer/ITokenized";
import {ICFGtree} from "./_types/CFG/ICFGtree";
import {ICFGstackItem} from "./_types/CFG/ICFGstackItem";
import {ICNFerror} from "./_types/CNF/ICNFerror";
import {ICNFtree} from "./_types/CNF/ICNFtree";
import {ICFGwalkStackItem} from "./_types/CFG/ICFGwalkStackItem";

let s = 0;
/** Generates a new symbol */
const g = () => s++ + "";

/**
 * A class that can be used to create an arbitrary Context Free Grammar, and allows for creation of an AST tree according to said grammar
 */
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
                            parts: pattern.parts.slice(0, pattern.parts.length - 1),
                        },
                    ];
                    symbols.push(newSymbol);
                    return {
                        ...pattern,
                        parts: [newSymbol, pattern.parts[pattern.parts.length - 1]],
                    };
                }
                return pattern;
            });
        }

        // DEL
        // for (let i = 0; i < symbols.length; i++) {
        //     const symbol = symbols[i];
        //     const options = cfg[symbol];

        //     for (let j = 0; j < options.length; j++) {
        //         const pattern = options.find(option=>option.parts.length==0);

        //     }
        // }

        // UNIT
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            const options = cfg[symbol];

            // TODO: add proper infinite recursion fix instead of it<1e4
            let it = 0;
            for (let j = 0; j < options.length && it++ < 1e4; j++) {
                const pattern = options[j];
                if (pattern.parts.length == 1) {
                    // Add the definitions of the part
                    const [part] = pattern.parts;
                    const copyOptions = cfg[part];
                    if (copyOptions) {
                        // Copy definitions of non terminal symbols
                        copyOptions.forEach(copyPattern =>
                            options.push({
                                ...copyPattern,
                                metaData: {
                                    parent: pattern.metaData,
                                    orPattern: copyPattern.metaData.orPattern,
                                },
                            })
                        );

                        // Remove the symbol
                        options.splice(j, 1);
                        j--;
                    } else {
                        options.splice(j, 1, {
                            ...pattern,
                            ...(pattern.metaData.orPattern && {
                                // ^ check to not define a parent without an orPattern
                                metaData: {
                                    parent: pattern.metaData,
                                    orPattern: undefined,
                                },
                            }),
                        });
                    }
                }
            }
        }

        // Convert the CNF complying grammar to CNF format
        const cnf = {};
        for (let i = 0; i < symbols.length; i++) {
            const symbol = symbols[i];
            const options = cfg[symbol];

            cnf[symbol] = options.map(pattern => ({
                left: pattern.parts[0],
                right: pattern.parts[1],
                metaData: {...pattern.metaData},
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
        const copyPattern = (pattern, symbol) => ({
            ...pattern,
            metaData: {orPattern: {...pattern, defSymbol: symbol}},
        });

        Object.keys(grammar).forEach(symbol => {
            const def = grammar[symbol];

            // Store the definition with the original definition as metadata
            cfg[symbol] = def.map(pattern => copyPattern(pattern, symbol));
        });

        return cfg;
    }

    /**
     * Creates a AST tree from a given input of lexical tokens
     * @param input The input
     * @returns The resulting tree or an error
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
                top.node = {...cnfNode} as any;
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
                    const children = [];

                    // Handle both left and right children the same
                    for (let i = 0; i < 2; i++) {
                        const child = childrenStack[i];

                        // Check if the symbol is part of our grammar
                        if (
                            this.grammar[child.node.symbol] ||
                            !("children" in child.node)
                        ) {
                            // If so, just store the child under the given name
                            children.push(child.node);
                        } else {
                            // Otherwise, merge the child's children with ours
                            children.push(...child.node.children);
                        }
                    }

                    // Assemble the node
                    const rs = children[0].range.start;
                    const re = children[children.length - 1].range.end;
                    const text = children.reduce((a, b) => a + b.text, "");
                    top.node = {
                        children,
                        range: {start: rs, end: re},
                        text,
                        pattern: cnfNode.pattern.metaData.orPattern,
                        symbol: cnfNode.symbol,
                    };
                }
            }

            if (top.node && "pattern" in cnfNode) {
                let metaData = cnfNode.pattern.metaData;

                // Create children copies with different patterns to revert UNIT rule
                while (metaData.parent) {
                    metaData = metaData.parent;

                    // Update the node to a node that wraps the current node
                    top.node = {
                        ...top.node,
                        symbol: metaData.orPattern.defSymbol,
                        pattern: metaData.orPattern,
                        children: [top.node],
                    };
                }
            }
            if (stack.length == 0) return top.node;
        }
    }

    /**
     * Walks a given tree, and calls the reduce function on every node
     * @param tree The tree to be walked
     * @param reduce The reduce function to invoke on every node
     * @returns The value returned by the reduce method on the root node
     */
    public static walkTree<V>(
        tree: ICFGtree,
        reduce: (node: ICFGtree, childVals: V[]) => V
    ): V {
        const c = (node: ICFGtree): ICFGwalkStackItem<V> => ({
            node,
            result: null,
            children: null,
        });
        const stack: ICFGwalkStackItem<V>[] = [c(tree)];

        while (stack.length > 0) {
            const top = stack[stack.length - 1];
            const {node} = top;

            // Check whether this is a base node
            if (!("children" in node)) {
                top.result = reduce(node, []);
                stack.pop();
                if (stack.length == 0) return top.result;
            } else {
                // Check whether the item was just pushed to the stack, of all children were just popped
                if (!top.children) {
                    // Add the node's children onto the stack
                    top.children = node.children.map(n => c(n));
                    stack.push(...top.children);
                } else {
                    // Call the reduce method using the children's values
                    stack.pop();
                    top.result = reduce(node, top.children.map(child => child.result));
                    if (stack.length == 0) return top.result;
                }
            }
        }
    }
}

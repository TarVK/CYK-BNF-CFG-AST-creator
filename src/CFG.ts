import {CNF} from "./CNF";

import {ICFG} from "./_types/CFG/ICFG";
import {ICFGnormalized, ICFGpatternNormalizedMetaData} from "./_types/CFG/ICFGnormalized";
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
        // All of these operations store relevant metadata in the derived patterns,
        // which can be used to construct the AST tree from the binary tree
        this.performBIN(cfg);
        this.performDEL(cfg);
        this.performUNIT(cfg);

        // Convert the CNF complying grammar to CNF format
        const symbols = Object.keys(cfg);
        const cnf = {};
        symbols.forEach(symbol => {
            const options = cfg[symbol];

            cnf[symbol] = options.map(pattern => ({
                left: pattern.parts[0],
                right: pattern.parts[1],
                metaData: {...pattern.metaData},
            }));
        });
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
     * Perform the BIN operation, splitting rules to ensure they have no more than 2 symbols
     * @param cfg The grammar to perform the operation on
     */
    protected performBIN(cfg: ICFGnormalized): void {
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
                        metaData: {
                            ...pattern.metaData,
                            leftRecursive: true,
                        },
                    };
                }
                return pattern;
            });
        }
    }

    /**
     * Perform the DEL operation, removing any empty patterns
     * @param cfg The grammar to perform the operation on
     */
    protected performDEL(cfg: ICFGnormalized): void {
        const symbols = Object.keys(cfg);
        const emptySymbols = []; // Collect a list of symbols that can match an empty string
        const emptySymbolMetaData = {};
        symbols.forEach(symbol => {
            const options = cfg[symbol];

            // Remove any empty patterns, but store their metadata
            cfg[symbol] = options.filter(option => {
                if (option.parts.length == 0)
                    emptySymbolMetaData[symbol] = option.metaData;
                return option.parts.length != 0;
            });

            // Indicate that this symbol had an empty pattern
            if (options.length != cfg[symbol].length) emptySymbols.push(symbol);
        });
        for (let i = 0; i < emptySymbols.length; i++) {
            const emptySymbol = emptySymbols[i];

            // Check if any patterns use this symbol, and if so, add option to leave out
            symbols.forEach(symbol => {
                const options = cfg[symbol];
                for (let j = 0; j < options.length; j++) {
                    const pattern = options[j];
                    const p = pattern.parts;
                    // Check if either part is the empty symbol
                    if (p.length > 1) {
                        if (p[0] == emptySymbol) {
                            cfg[symbol].push({
                                parts: [p[1]],
                                metaData: {
                                    ...pattern.metaData,
                                    leftEmpty: emptySymbolMetaData[emptySymbol],
                                },
                            });
                        }
                        if (p[1] == emptySymbol) {
                            cfg[symbol].push({
                                parts: [p[0]],
                                metaData: {
                                    ...pattern.metaData,
                                    rightEmpty: emptySymbolMetaData[emptySymbol],
                                },
                            });
                        }
                    }

                    // If all symbols can be the empty symbol, indicate this pattern can be empty
                    else if (p[0] == emptySymbol && !emptySymbols.includes(symbol)) {
                        emptySymbols.push(symbol);
                        emptySymbolMetaData[symbol] = {
                            ...pattern.metaData,
                            ...(pattern.metaData.leftEmpty
                                ? {rightEmpty: emptySymbolMetaData[emptySymbol]}
                                : {leftEmpty: emptySymbolMetaData[emptySymbol]}),
                        };
                    }
                }
            });
        }
    }

    /**
     * Perform the UNIT operation, removing any patterns with just 1 part
     * @param cfg The grammar to perform the operation on
     */
    protected performUNIT(cfg: ICFGnormalized): void {
        const symbols = Object.keys(cfg);
        const copy = {};
        symbols.forEach(symbol => (copy[symbol] = [...cfg[symbol]]));
        symbols.forEach(symbol => {
            const options = cfg[symbol];

            // TODO: add proper infinite recursion fix instead of it<1e4
            let it = 0;
            for (let j = 0; j < options.length && it++ < 1e4; j++) {
                const pattern = options[j];
                if (pattern.parts.length == 1) {
                    // Add the definitions of the part
                    const [part] = pattern.parts;
                    const copyOptions = copy[part]; // Use the copy, to make sure we don't use modified rules
                    if (part == symbol) continue; // prevent infinite recursion
                    if (copyOptions) {
                        // Copy definitions of non terminal symbols
                        copyOptions.forEach(copyPattern =>
                            options.push({
                                ...copyPattern,
                                metaData: {
                                    ...copyPattern.metaData,
                                    parent: pattern.metaData,
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
        });
    }

    /**
     * Creates a AST tree from a given input of lexical tokens
     * @param input The input
     * @returns The resulting tree or an error
     */
    public createASTtree(input: ITokenized): ICFGtree | ICNFerror {
        // Parse the tree using CNF
        const binaryTree = this.CNF.createBinaryTree(input);
        if ("error" in binaryTree) return binaryTree;

        // Creates an empty cnf node
        const ecnf = (
            loc: number,
            metaData: ICFGpatternNormalizedMetaData
        ): ICNFtree => ({
            text: "",
            range: {start: loc, end: loc},
            symbol: metaData.orPattern.defSymbol,
        });

        // Creates a stack item
        const c = (
            node: ICNFtree,
            metaData?: ICFGpatternNormalizedMetaData,
            children?: ICFGstackItem[]
        ): ICFGstackItem => ({
            cnfNode: node,
            metaData: metaData || (node.pattern && node.pattern.metaData) || {},
            children: children || [],
            range: node.range,
            initialized: false,
        });

        // Walk the tree and combine metadata with tree data to retrieve a tree in the shape of the original CFG
        const stack: ICFGstackItem[] = [c(binaryTree)];
        while (stack.length > 0) {
            const top = stack[stack.length - 1];
            const {cnfNode, metaData, children, initialized, range} = top;

            if (!initialized) {
                top.initialized = true;

                // Add any left 'empty' child to the children to account for the DEL rule
                if (metaData.leftEmpty)
                    children.unshift(
                        c(ecnf(range.start, metaData.leftEmpty), metaData.leftEmpty)
                    );

                // Add the original children
                if (cnfNode && "left" in cnfNode) {
                    if (cnfNode.left) children.push(c(cnfNode.left));
                    if (cnfNode.right) children.push(c(cnfNode.right));
                }

                // Add any right 'empty' child to the children to account for the DEL rule
                if (metaData.rightEmpty)
                    children.push(
                        c(ecnf(range.start, metaData.rightEmpty), metaData.rightEmpty)
                    );

                // Undo UNIT rule by pushing parent data onto the stack as long as there is any
                if (metaData.parent) {
                    // Create a copy of this stack item
                    const si = {...top, metaData: {...top.metaData, parent: undefined}};

                    // Transform this item to its parent
                    top.children = [si];
                    top.metaData = metaData.parent;
                    delete top.cnfNode;
                    top.initialized = false; // We need to reinitialize for this new parent node

                    // Add the stack item to the stack
                    stack.push(si);
                }
                stack.push(...children);
            } else {
                // Check whether this is a base token
                if (cnfNode && !("left" in cnfNode) && !metaData.leftEmpty) {
                    stack.pop();
                    top.node = {
                        range: cnfNode.range,
                        text: cnfNode.text,
                        symbol: cnfNode.symbol,
                        ...(metaData.orPattern && {pattern: metaData.orPattern}),
                    };
                } else {
                    // Pop the stack item and assemble the node using its children
                    stack.pop();

                    // Collect the child nodes and undo the BIN rule
                    const childNodes = children.map(child => child.node);
                    if (metaData.leftRecursive)
                        childNodes.splice(0, 1, ...(childNodes[0] as any).children);

                    // Assemble the node
                    const rs = childNodes[0].range.start;
                    const re = childNodes[childNodes.length - 1].range.end;
                    const text = childNodes.reduce((a, b) => a + b.text, "");
                    top.node = {
                        children: childNodes,
                        range: {start: rs, end: re},
                        text,
                        pattern: metaData.orPattern,
                        symbol: metaData.orPattern.defSymbol,
                    };
                }
            }

            // Return the result if this was the last node
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
                    top.result = reduce(
                        node,
                        top.children.map(child => child.result)
                    );
                    if (stack.length == 0) return top.result;
                }
            }
        }
    }
}

import {ICNF} from "./_types/CNF/ICNF";
import {IReverseCNF} from "./_types/CNF/IReverseCNF";
import {ICYKtable, ICYKcell} from "./_types/CNF/ICYKtable";
import {ICNFtree} from "./_types/CNF/ICNFtree";
import {ITokenized} from "./_types/Tokenizer/ITokenized";
import {ICNFstackItem} from "./_types/CNF/ICNFstackItem";
import {ICNFerror} from "./_types/CNF/ICNFerror";

/**
 * A class to represent a CNF grammar, and allows for creation of a binary tree from a token array
 */
export class CNF {
    // The grammar
    protected grammar: ICNF;

    // The symbol that the matched input should have as a whole
    protected startSymbol: string;

    // The lookup table, such that a symbol can be obtained given its definition
    protected lookupTable: IReverseCNF;

    /**
     * Creates a new instance
     * @param grammar The grammmar to create an instance for
     * @param startSymbol The symbol that a matched string should have
     */
    constructor(grammar: ICNF, startSymbol: string) {
        this.grammar = grammar;
        this.startSymbol = startSymbol;
        this.lookupTable = this.createLookupTable(grammar);
    }

    /**
     * Creates a lookup table for the grammar
     * @param grammar The grammar to create a lookup table for
     * @returns The lookup table for a given grammar
     */
    protected createLookupTable(grammar: ICNF): IReverseCNF {
        const lookup: IReverseCNF = {};

        /**
         * Given a CNF:
         * ```js
         * {
         *   A:[{left:"C", right:"D"}],
         *   B:[{left:"D", right:"D"}, {left:"D", right:"E"}]
         * }
         * ```
         * Creates a lookup table:
         * ```js
         * {
         *   C: {D: [{left:"C", right:"D", defSymbol:"A"}]},
         *   D: {D: [{left:"D", right:"D", defSymbol:"B"}],
         *       E: [{left:"D", right:"E", defSymbol:"B"}]}
         * }
         * ```
         */

        // Go through all definitions
        Object.keys(grammar).forEach(symbol => {
            const options = grammar[symbol];

            // Go through the options of every definition
            options.forEach(option => {
                // Make sure an object exists to store all patterns that containt he left symbol
                if (!lookup[option.left]) lookup[option.left] = {};

                // Make sure an object exists to store all the patterns that contain the left and right symbol
                const leftMap = lookup[option.left];
                if (!leftMap[option.right]) leftMap[option.right] = [];

                // Add the pattern to the map
                const leftAndRightMap = leftMap[option.right];
                leftAndRightMap.push({...option, defSymbol: symbol});
            });
        });

        return lookup;
    }

    /**
     * Creates a CYk table given an input string
     * @param input The input tokens
     * @param approximate Whether to allow changing a right token to improve the match
     * @returns The table
     */
    public performCYK(input: ITokenized, approximate?: boolean): ICYKtable {
        // usage of re represents the column or range end, and rs the row or range start (as index of the token)

        // Declare the table
        const table: ICYKtable = [];
        for (let rs = 0; rs < input.length; rs++) table[rs] = [];
        for (let re = 0; re < input.length; re++) {
            for (let rs = re; rs >= 0; rs--) {
                const cell = (table[rs][re] = {
                    symbols: [],
                    definitions: [],
                    range: {start: null, end: null},
                }) as ICYKcell;

                // Initialize the value if it's on the diagonal
                if (rs == re) {
                    const s = input[rs].symbol;
                    cell.symbols.push(s);

                    // Copy all the definitions and symbols that match
                    const t = this.lookupTable[s];
                    if (t && t["undefined"])
                        t["undefined"].forEach(def => {
                            if (!cell.symbols.includes(def.defSymbol))
                                cell.symbols.push(def.defSymbol);
                            cell.definitions.push({index: rs, ...def});
                        });

                    cell.range = input[rs].range;
                } else {
                    cell.range.start = table[rs][rs].range.start;
                    cell.range.end = table[re][re].range.end;
                }
            }
        }

        // Fill the table (skipping the diagonal since that's already initialized)
        for (let re = 1; re < input.length; re++) {
            for (let rs = re - 1; rs >= 0; rs--) {
                const cell = table[rs][re];
                // Go through all the options for combining subparts
                for (let k = rs; k < re; k++) {
                    // Get this option for left and right pair
                    let left = table[rs][k];
                    let right = table[k + 1][re];

                    // Go through all combinations of left and right symbol options
                    for (let lsI = 0; lsI < left.symbols.length; lsI++) {
                        const leftSymbol = left.symbols[lsI];
                        // Check the lookup to see if this fits a definition
                        const leftDefs = this.lookupTable[leftSymbol];
                        if (!leftDefs) continue;

                        // Combine it with all the right options
                        for (let rsI = 0; rsI < right.symbols.length; rsI++) {
                            const rightSymbol = right.symbols[rsI];
                            const defs = leftDefs[rightSymbol];
                            if (!defs) continue;

                            // Add all the definitions to the cell
                            for (let defI = 0; defI < defs.length; defI++) {
                                const def = defs[defI];
                                if (!cell.symbols.includes(def.defSymbol))
                                    cell.symbols.push(def.defSymbol);
                                cell.definitions.push({index: k, ...def});
                            }
                        }
                    }
                }
            }
        }

        // return the result
        return table;
    }

    /**
     * Retrieves the binary tree of some input
     * @param input The input to construct a tree for
     * @returns The tree
     */
    public createBinaryTree(input: ITokenized): ICNFtree | ICNFerror {
        // Obtain the table using CYK
        const table = this.performCYK(input);

        // Check if we matched the whole input with the required start symbol, and return an error otherwise
        let re = input.length - 1;
        table[0][re].symbols = table[0][re].symbols.filter(
            value => value == this.startSymbol
        );
        if (table[0][re].symbols.length == 0) return {error: true, table};

        // Create a tree from this info
        const c = (rs: number, re: number, symbol: string): ICNFstackItem => ({
            cell: table[rs][re],
            index: [rs, re],
            symbol,
            node: null,
            pattern: null,
            left: null,
            right: null,
        });
        const stack: ICNFstackItem[] = [c(0, re, this.startSymbol)];
        while (stack.length > 0) {
            const top = stack[stack.length - 1];
            const cell = top.cell;
            const [rs, re] = top.index;

            // Check whether this is a base token, or combined token
            if (rs == re) {
                // Remove the item from the stack, and create the node
                stack.pop();
                const definition = cell.definitions.find(
                    def => def.defSymbol == top.symbol
                );
                top.node = {
                    ...input[rs],
                    ...(definition && {pattern: definition}),
                };
                if (stack.length == 0) return top.node;
            } else {
                // Check whether the item was just pushed to the stack, of all children were just popped
                if (!top.left) {
                    // Get the definition to use, and create the child items to add to the stack
                    const definition = (top.pattern = cell.definitions.find(
                        def => def.defSymbol == top.symbol
                    ));
                    const left = (top.left = c(rs, definition.index, definition.left)),
                        right = (top.right = c(
                            definition.index + 1,
                            re,
                            definition.right
                        ));
                    stack.push(left, right);
                } else {
                    // Pop the stack item, and assemble the node using the children
                    stack.pop();
                    const left = top.left.node;
                    const right = top.right.node;
                    top.node = {
                        symbol: top.pattern.defSymbol,
                        left,
                        right,
                        pattern: top.pattern,
                        range: {start: left.range.start, end: right.range.end},
                        text: left.text + right.text,
                    };
                    if (stack.length == 0) return top.node;
                }
            }
        }
    }
}

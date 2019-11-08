import {ICNF, Isymbol} from "./_types/CNF/ICNF";
import {IReverseCNF} from "./_types/CNF/IReverseCNF";
import {ICYKtable} from "./_types/CNF/ICYKtable";
import {ICNFtree} from "./_types/CNF/ICNFtree";

/**
 * A class to represent a CNF grammar, and allows for creation of a binary tree from a token array
 */
export class CNF {
    // The grammar
    protected grammar: ICNF;

    // The lookup table, such that a symbol can be obtained given its definition
    protected lookupTable: IReverseCNF;

    /**
     * Creates a new instance
     * @param grammar The grammmar to create an instance for
     */
    constructor(grammar: ICNF) {
        this.grammar = grammar;
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
            const definition = grammar[symbol];

            // Go through the options of every definition
            const options = definition instanceof Array ? definition : definition.options;
            options.forEach(option => {
                // Make sure an object exists to store all patterns that containt he left symbol
                if (!lookup[option.left]) lookup[option.left] = {};

                // Make sure an object exists to store all the patterns that contain the left and right symbol
                const leftMap = lookup[option.left];
                if (!leftMap[option.right]) leftMap[option.right] = [];

                // Add the pattern to the map
                const leftAndRightMap = (leftMap[option.right] = []);
                leftAndRightMap.push({...option, defSymbol: symbol});
            });
        });

        return lookup;
    }

    /**
     * Creates a CYk table given an input string
     * @param input The input tokens
     * @returns The table
     */
    public performCYK(input: Isymbol[]): ICYKtable {
        // Declare the table
        const table: ICYKtable = [];
        for (let i = 0; i < input.length; i++) {
            // i represents the column, and j the row
            table[i] = [];
            for (let j = 0; j <= i; j++) {
                table[i][j] = {symbols: [], definitions: []};

                // Initialize the value if it's on the diagonal
                if (i == j) table[i][j].symbols.push(input[i]);
            }
        }

        // Fill the table (skipping the diagonal since that's already initialized)
        for (let i = 1; i < input.length; i++) {
            for (let j = i - 1; j >= 0; j--) {
                const cell = table[i][j];

                // Go through all the options for combining subparts
                for (let k = j; k < i; k++) {
                    let il = k;
                    let jl = j - k + i; // starts at i, ends at j+1 in the loop

                    // Get this option for left and right pair
                    let left = table[il][j];
                    let right = table[i][jl];

                    // Go through all combinations of left and right symbol options
                    for (let LSI = 0; LSI < left.symbols.length; LSI++) {
                        const leftSymbol = left.symbols[LSI];
                        // Check the lookup to see if this fits a definition
                        const leftDefs = this.lookupTable[leftSymbol];
                        if (!leftDefs) continue;

                        // Combine it with all the right options
                        for (let RSI = 0; RSI < right.symbols.length; RSI++) {
                            const rightSymbol = right.symbols[RSI];
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
    public getBinaryTree(input: Isymbol[]): ICNFtree {
        return undefined;
    }
}

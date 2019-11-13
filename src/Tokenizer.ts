import {ITokenizer} from "./_types/Tokenizer/ITokenizer";
import {ITokenized} from "./_types/Tokenizer/ITokenized";
import {ITokenizeError} from "./_types/Tokenizer/ITokenizeError";
import {ITokenizerNormalized} from "./_types/Tokenizer/ITokenizerNormalized";

//https://stackoverflow.com/a/6969486/3080469
function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

export class Tokenizer {
    // The tokenizer data
    protected tokenizer: ITokenizerNormalized;

    /**
     * Creates a tokenizer
     * @param tokenizer The tokenizer data
     */
    constructor(tokenizer: ITokenizer) {
        this.tokenizer = Object.keys(tokenizer).map(symbol => [
            symbol,
            typeof tokenizer[symbol] == "string"
                ? new RegExp(escapeRegExp(tokenizer[symbol]), "y")
                : new RegExp(tokenizer[symbol], "y"),
        ]);
    }

    /**
     * Tokenize the given input
     * @param input
     */
    public tokenize(input: string): ITokenized | ITokenizeError {
        const tokens: ITokenized = [];

        let index = 0;
        outer: while (true) {
            // Try all matchers
            for (let i = 0; i < this.tokenizer.length; i++) {
                const [symbol, regex] = this.tokenizer[i];
                regex.lastIndex = index;
                const match = regex.exec(input);

                // If a match was found, continue
                if (match) {
                    tokens.push({
                        symbol: symbol,
                        text: match[0],
                        range: {start: index, end: index + match[0].length},
                    });
                    index += match[0].length;
                    if (match[0].length == 0)
                        if (index == input.length) break;
                        else
                            throw Error(
                                "Regex may not match 0 length strings: " +
                                    regex +
                                    ", use an empty pattern in the CFG instead"
                            );
                    continue outer;
                }
            }

            // If no match could be mage
            if (index == input.length) return tokens;
            else return {error: true, index};
        }
    }
}

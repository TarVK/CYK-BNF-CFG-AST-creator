import { ITokenizer } from "./_types/Tokenizer/ITokenizer";
import { ITokenized } from "./_types/Tokenizer/ITokenized";
import { ITokenizeError } from "./_types/Tokenizer/ITokenizeError";
import { ITokenizerNormalized } from "./_types/Tokenizer/ITokenizerNormalized";
export declare class Tokenizer {
    protected tokenizer: ITokenizerNormalized;
    /**
     * Creates a tokenizer
     * @param tokenizer The tokenizer data
     */
    constructor(tokenizer: ITokenizer);
    /**
     * Tokenize the given input
     * @param input
     */
    tokenize(input: string): ITokenized | ITokenizeError;
}

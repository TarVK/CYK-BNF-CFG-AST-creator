import { ISymbol } from "./CNF/ICNF";
export declare type ITokenized = ({
    symbol: ISymbol;
    text: string;
    range: {
        start: number;
        end: number;
    };
})[];

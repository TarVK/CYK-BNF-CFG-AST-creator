import {ISymbol} from "../CNF/ICNF";

export type ITokenized = ({
    symbol: ISymbol;
    text: string;
    range: {
        start: number;
        end: number;
    };
})[];

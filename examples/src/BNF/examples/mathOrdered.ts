export const mathOrderedExample = {
    name: "math ordered",
    bnf: `
<Exp>     ::= <Exp> "+" <Term>          | <Exp> "-" <Term>      | <Term>
<Term>    ::= <Term> "*" <Factor>       | <Term> "/" <Factor>   | <Factor>
<Factor>  ::= <Factor> "^" <Primary>    | <Primary>
<Primary> ::= <OS> "(" <Exp> ")" <OS>   | <OS> <Number> <OS>
<OS>      ::= <OS> " "                  | ""
<Number>  ::= <Digits> "." <Digits>     | "." <Digits>          | <Digits>
<Digits>  ::= <Digits> <Digit>          | <Digit>
<Digit>   ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
`.trim(),
    input: "25 * (3^.5)",
};

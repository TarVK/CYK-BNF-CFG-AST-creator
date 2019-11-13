export const mathFlatExample = {
    name: "math flat",
    bnf: `
<Exp>      ::= <Exp> "+" <Exp> | <Exp> "-" <Exp> | <Exp> "*" <Exp> | <Exp> "/" <Exp> | <Exp> "^" <Exp> | <OptSpace> "(" <Exp> ")" <OptSpace> | <OptSpace> <Number> <OptSpace>
<OptSpace> ::= <OptSpace> " " | ""
<Number>   ::= <Digits> "." <Digits> | "." <Digits> | <Digits>
<Digits>   ::= <Digits><Digit> | <Digit>
<Digit>    ::= "0"|"1"|"2"|"3"|"4"|"5"|"6"|"7"|"8"|"9"
`.trim(),
    input: "25 * (3^.5)",
};

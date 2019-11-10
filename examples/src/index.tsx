import {
    CNF,
    CFG,
    Tokenizer,
    Interpreter,
    BNFinterpreter,
    BNF,
} from "CYK-BNF-CFG-AST-creator";

// window["CNF"] = CNF;

// // create some test CNF
// window["someCNF"] = new CNF(
//     {
//         H: [{left: "B", right: "J"}],
//         I: [{left: "H", right: "C"}],
//         J: [
//             {left: "K", right: "J"},
//             {left: "L", right: "J"},
//             {left: "M", right: "J"},
//             {left: "N", right: "J"},
//             {left: "K", right: "I"},
//             {left: "L", right: "I"},
//             {left: "M", right: "I"},
//             {left: "N", right: "I"},
//             {left: "K", right: "A"},
//             {left: "L", right: "A"},
//             {left: "M", right: "A"},
//             {left: "N", right: "A"},
//         ],
//         K: [{left: "J", right: "D"}, {left: "I", right: "D"}, {left: "A", right: "D"}],
//         L: [{left: "J", right: "E"}, {left: "I", right: "E"}, {left: "A", right: "E"}],
//         M: [{left: "J", right: "F"}, {left: "I", right: "F"}, {left: "A", right: "F"}],
//         N: [{left: "J", right: "G"}, {left: "I", right: "G"}, {left: "A", right: "G"}],
//     },
//     "J"
// );

// window["someInput"] = [
//     {symbol: "A", text: "1343", range: {start: 0, end: 3}},
//     {symbol: "D", text: "*", range: {start: 4, end: 4}},
//     {symbol: "B", text: "(", range: {start: 5, end: 5}},
//     {symbol: "A", text: "12", range: {start: 6, end: 7}},
//     {symbol: "F", text: "-", range: {start: 8, end: 8}},
//     {symbol: "A", text: "35", range: {start: 9, end: 10}},
//     {symbol: "C", text: ")", range: {start: 11, end: 11}},
//     {symbol: "E", text: "/", range: {start: 12, end: 12}},
//     {symbol: "A", text: "23", range: {start: 13, end: 15}},
//     {symbol: "G", text: "+", range: {start: 16, end: 16}},
//     {symbol: "A", text: "7", range: {start: 17, end: 17}},
// ];
// // window["someInput"] = [
// //     {symbol: "A", text: "1343", range: {start: 0, end: 3}},
// //     {symbol: "D", text: "*", range: {start: 4, end: 4}},
// //     {symbol: "B", text: "(", range: {start: 5, end: 5}},
// //     {symbol: "A", text: "12", range: {start: 6, end: 7}},
// //     {symbol: "F", text: "-", range: {start: 8, end: 8}},
// //     {symbol: "A", text: "35", range: {start: 9, end: 10}},
// //     {symbol: "A", text: "3", range: {start: 11, end: 11}},
// //     {symbol: "E", text: "/", range: {start: 12, end: 12}},
// //     {symbol: "A", text: "23", range: {start: 13, end: 15}},
// //     {symbol: "G", text: "+", range: {start: 16, end: 16}},
// //     {symbol: "A", text: "7", range: {start: 17, end: 17}},
// // ];

// window["someTokenizer"] = new Tokenizer({
//     Num: /\s*([0-9]*\.)?[0-9]+\s*/,
//     Mul: /\*/,
//     Div: /\//,
//     Add: /\+/,
//     Sub: /\-/,
//     Pow: /\^/,
//     LParen: /\s*\(/,
//     RParen: /\)\s*/,
// });
// window["someCFG"] = new CFG(
//     {
//         Exp: [
//             {parts: ["Exp", "AddOp", "Term"]},
//             {parts: ["AddOp", "Term"]},
//             {parts: ["Term"]},
//         ],
//         Term: [{parts: ["Term", "MulOp", "Factor"]}, {parts: ["Factor"]}],
//         Factor: [{parts: ["Factor", "Pow", "Primary"]}, {parts: ["Primary"]}],
//         Primary: [{parts: ["LParen", "Exp", "RParen"]}, {parts: ["Num"]}],
//         AddOp: [{parts: ["Add"]}, {parts: ["Sub"]}],
//         MulOp: [{parts: ["Mul"]}, {parts: ["Div"]}],
//     },
//     "Exp"
// );

// window["interpreter"] = new Interpreter<number, any>(
//     {
//         tokenizer: {
//             Num: {match: /\s*([0-9]*\.)?[0-9]+\s*/, eval: text => Number(text)},
//             Mul: "*",
//             Div: "/",
//             Add: "+",
//             Sub: "-",
//             Pow: "*",
//             LParen: /\s*\(/,
//             RParen: /\)\s*/,
//         },
//         grammar: {
//             Exp: [
//                 {
//                     parts: ["Exp", "Add", "Term"],
//                     eval: ([l, op, r]) => l + r,
//                 },
//                 {
//                     parts: ["Exp", "Sub", "Term"],
//                     eval: ([l, op, r]) => l - r,
//                 },
//                 {parts: ["Add", "Term"], eval: (op, r) => r},
//                 {parts: ["Sub", "Term"], eval: (op, r) => -r},
//                 {parts: ["Term"], eval: ([v]) => v},
//             ],
//             Term: [
//                 {
//                     parts: ["Term", "Mul", "Factor"],
//                     eval: ([l, op, r]) => l * r,
//                 },
//                 {
//                     parts: ["Term", "Div", "Factor"],
//                     eval: ([l, op, r]) => l / r,
//                 },
//                 {parts: ["Factor"], eval: ([v]) => v},
//             ],
//             Factor: [
//                 {
//                     parts: ["Factor", "Pow", "Primary"],
//                     eval: ([l, op, r]) => Math.pow(l, r),
//                 },
//                 {parts: ["Primary"], eval: ([v]) => v},
//             ],
//             Primary: [
//                 {parts: ["LParen", "Exp", "RParen"], eval: ([lp, n, rp]) => n},
//                 {parts: ["Num"], eval: ([v]) => v},
//             ],
//         },
//     },
//     "Exp"
// );

window["CFG"] = CFG;
window["bnf"] = BNFinterpreter;
window["BNF"] = BNF;

window["bnfBNF"] = new BNF(
    `
 <syntax>         ::= <rule> | <rule> <syntax>
 <rule>           ::= <opt-whitespace> "<" <rule-name> ">" <opt-whitespace> "::=" <opt-whitespace> <expression> <line-end>
 <opt-whitespace> ::= " " <opt-whitespace> | " "
 <expression>     ::= <list> | <list> <opt-whitespace> "|" <opt-whitespace> <expression>
 <line-end>       ::= <opt-whitespace> <EOL> | <line-end> <line-end>
 <list>           ::= <term> | <term> <opt-whitespace> <list>
 <term>           ::= <literal> | "<" <rule-name> ">"
 <literal>        ::= '"' <text1> '"' | "'" <text2> "'"
 <text1>          ::= <character1> | <character1> <text1>
 <text2>          ::= <character2> | <character2> <text2>
 <character>      ::= <letter> | <digit> | <symbol>
 <letter>         ::= "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z" | "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
 <digit>          ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
 <symbol>         ::=  "|" | " " | "!" | "#" | "$" | "%" | "&" | "(" | ")" | "*" | "+" | "," | "-" | "." | "/" | ":" | ";" | ">" | "=" | "<" | "?" | "@" | "[" | "\" | "]" | "^" | "_" | "\`" | "{" | "}" | "~"
 <character1>     ::= <character> | "'"
 <character2>     ::= <character> | '"'
 <rule-name>      ::= <letter> | <rule-name> <rule-char>
 <rule-char>      ::= <letter> | <digit> | "-"
`.trim()
);

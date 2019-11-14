# CYK-BNF-CFG-AST-creator
This project with an obnoxious name contains a couple of classes that can be used to define a context free grammar. 

## Usage
The system as a whole is not very efficient, so I have decided to not publish anything to npm.
I just created this as an enjoyable project for myself, not with the intention for people to use it. 
There are probably better systems out there, but if you really want you can always copy the files manually.
The classes and algorithms aren't masively complex, and I tried to keep the code reasonably managable, so code could be translated (by you) to some other language if desired as well. 

If you have no clue what any of these things mean but you're interested in it, look into [context-free grammars](https://en.wikipedia.org/wiki/Context-free_grammar)

## Demos
I have made 3 semi-realistic use cases of the classes provided in this project:
- [BNF playground](https://tarvk.github.io/CYK-BNF-CFG-AST-creator/examples/build/#/bnf), a page in which BNF definitions of a language can be tested
- [REPL calculator](https://tarvk.github.io/CYK-BNF-CFG-AST-creator/examples/build/#/calculator), a simple calculator that immediately evaluates a formula
- [Plotter](https://tarvk.github.io/CYK-BNF-CFG-AST-creator/examples/build/#/plotter), a simple plotter that compiles the formula to a simple operations array, to be executed many times in an efficient manner

Note that the plotter actually makes use of [function-plot](https://github.com/mauriciopoppe/function-plot) which already has it's own evaluator build in which is way more capable than mine. My code is just meant to show how any arbitrary data can be obtained using the interpreter. 

## Classes
This project is comprised of 5 classes, that increase in complexity and build up on each other. 
### Tokenizer
The project contains a very simple Tokenizer that can be used to split an input string into tokens, simply using a regex search.
```ts
import {Tokenizer} from "CYK-BNF-CFG-AST-creator";
const tokenizer = new Tokenizer({
    Num: /\s*([0-9]*\.)?[0-9]+\s*/,
    Mul: /\*/,
    Div: /\//,
    Add: /\+/,
    Sub: /\-/,
    Pow: /\^/,
    LParen: /\s*\(/,
    RParen: /\)\s*/,
});
const tokens = tokenizer.tokenize("5(45*.3)");
```
### CNF
The project contains a class to create a binary tree from a token list, according to a [Chomsky Normal Form grammar](https://en.wikipedia.org/wiki/Chomsky_normal_form). 
To achieve this, the [CYK algorithm](https://en.wikipedia.org/wiki/CYK_algorithm) is used, after which the table is traversed to obtain a valid tree. This is a dynamic programming approach that doesn't put any restrictions on what grammars can be matched, but it does run in &Theta;(n^3) time.
```ts
import {CNF} from "CYK-BNF-CFG-AST-creator";
const cnf = new CNF(
    {
        EXP: [
            {left: "ADD", right: "EXP", metaData:5}, // We can attach any metadata to an expression under the metaData key
            {left: "SUB", right: "EXP"},
            {left: "DIV", right: "EXP"},
            {left: "MUL", right: "EXP"},
            {left: "Num"},
        ],
        ADD: [{left: "EXP", right: "Add"}],
        SUB: [{left: "EXP", right: "Sub"}],
        DIV: [{left: "EXP", right: "Div"}],
        MUL: [{left: "EXP", right: "Mul"}],
    },
    "EXP" // The start symbol
);
const tree = cnf.createBinaryTree([
    {symbol:"Num", text:"34", range:{start:0, end:2}},
    {symbol:"Add", text:"+", range:{start:2, end:3}},
    {symbol:"Num", text:"2", range:{start:3, end:4}}
]);
```
### CFG
Since it's quite annoying/difficult to formulate a context free grammar in CNF, a higher level CFG class exists.
This class internally translates the passed grammar into a grammar in CNF using the steps described [here](https://en.wikipedia.org/wiki/Chomsky_normal_form#Converting_a_grammar_to_Chomsky_normal_form). During this translation, metadata associating rules with rules from the initial CFG are kept. We can then apply CYK to some input sequence and obtain a binary tree. From this binary tree a tree in the form of the original CFG is obtained using the stored metadata, using a custom approach/algorithm.
```ts
import {CFG} from "CYK-BNF-CFG-AST-creator";
const cfg = new CFG(
    {
        EXP: [
            {parts: ["EXP", "Add", "EXP"], metaData:5}, // We can attach any metadata to an expression under the metaData key
            {parts: ["EXP", "Sub", "EXP"]}, 
            {parts: ["EXP", "Mul", "EXP"]}, 
            {parts: ["EXP", "Div", "EXP"]}, 
            {parts: ["Num"]}
        ],
    },
    "Exp"
);
const tree = cfg.createAstTree([
    {symbol:"Num", text:"34", range:{start:0, end:2}},
    {symbol:"Add", text:"+", range:{start:2, end:3}},
    {symbol:"Num", text:"2", range:{start:3, end:4}}
]);
```
If we want a symbol to be able to match 0 tokens, we can just create a definition `{parts:[]}`

### Interpreter
The Interpreter class simply combines the tokenizer and CFG classes, and automatically walks the obtained AST tree to invoke functions for every node and reduce the tree to some result. This result could be anything, so it can be used for compiling and transpiling as well as interpreting. 

<details>

<summary>
Simple math interpreter example
</summary>

```ts
 const mathInterpreter = new Interpreter(
    {
        tokenizer: {
            Num: {
                match: /\s*([0-9]*\.)?[0-9]+\s*/, 
                eval: text => Number(text)
            },
            Func: {
                match: /\s*(sin|cos|sqrt)\s*/,
                eval: (text, match) => match[1],
            },
            Mul: "*",
            Div: "/",
            Add: "+",
            Sub: "-",
            Pow: "^",
            LParen: /\s*\(/,
            RParen: /\)\s*/,
        },
        grammar: {
            Exp: [
                {
                    parts: ["Exp", "Add", "Term"],
                    eval: ([l, op, r]) => l + r,
                },
                {
                    parts: ["Exp", "Sub", "Term"],
                    eval: ([l, op, r]) => l - r,
                },
                {parts: ["Add", "Term"], eval: ([op, r]) => r},
                {parts: ["Sub", "Term"], eval: ([op, r]) => -r},
                {parts: ["Term"], eval: ([v]) => v},
            ],
            Term: [
                {
                    parts: ["Term", "Mul", "Factor"],
                    eval: ([l, op, r]) => l * r,
                },
                {
                    parts: ["Term", "Factor"],
                    eval: ([l, r]) => l * r,
                },
                {
                    parts: ["Term", "Div", "Factor"],
                    eval: ([l, op, r]) => l / r,
                },
                {parts: ["Factor"], eval: ([v]) => v},
            ],
            Factor: [
                {
                    parts: ["Factor", "Pow", "Primary"],
                    eval: ([l, op, r]) => Math.pow(l, r),
                },
                {
                    parts: ["Func", "Primary"],
                    eval: ([op, v]) => Math[op](v),
                },
                {parts: ["Primary"], eval: ([v]) => v},
            ],
            Primary: [
                {parts: ["LParen", "Exp", "RParen"], eval: ([lp, n, rp]) => n},
                {parts: ["Num"], eval: ([v]) => v},
            ],
        },
    },
    "Exp"
);
const result = mathInterpreter.evaluate("3+4*5");
```

</details>

### BNF
A BNF class is included in order to essentially create a CFG, but instead define it using a [BNF syntax](https://en.wikipedia.org/wiki/Backus%E2%80%93Naur_form), rather than a json definition of a Tokenizer and CFG. 
```ts
import {BNF} from "CYK-BNF-CFG-AST-creator";
const bnf = new BNF(`
    <Exp>     ::= <Exp> "+" <Term>          | <Exp> "-" <Term>      | <Term>
    <Term>    ::= <Term> "*" <Factor>       | <Term> "/" <Factor>   | <Factor>
    <Factor>  ::= <Factor> "^" <Primary>    | <Primary>
    <Primary> ::= <OS> "(" <Exp> ")" <OS>   | <OS> <Number> <OS>
    <OS>      ::= <OS> " "                  | ""
    <Number>  ::= <Digits> "." <Digits>     | "." <Digits>          | <Digits>
    <Digits>  ::= <Digits> <Digit>          | <Digit>
    <Digit>   ::= "0" | "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"
`);
const tree = bnf.createASTtree("3+4*5");
```

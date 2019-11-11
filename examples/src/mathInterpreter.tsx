import {Interpreter} from "CYK-BNF-CFG-AST-creator";

const mathInterpreter = new Interpreter<number, any>(
    {
        tokenizer: {
            Num: {match: /\s*([0-9]*\.)?[0-9]+\s*/, eval: text => Number(text)},
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
console.log(mathInterpreter.evaluate("-30-(25+5)*2"));

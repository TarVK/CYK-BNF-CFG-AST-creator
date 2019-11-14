import {Interpreter} from "CYK-BNF-CFG-AST-creator";
import {Variables, execute} from "./mathExecutor";
import {executeInterval} from "./mathExecutorInterval";

// Adds an operation to the context's operations array (uses the fact that tree walk performs a depth first walk)
const addOp = (context, type, ...children) => {
    let result = context.result;
    if (!context.result) result = context.result = [];
    result.push({type: type, ...children});
    return result.length - 1;
};

/**
 * An object to compile a simple mathematical expression into an array of operations that can easily be executed repeadetly
 */
export const mathCompiler = new Interpreter<any, any>(
    {
        tokenizer: {
            Num: {
                match: /\s*([0-9]*\.)?[0-9]+\s*/,
                eval: text => Number(text),
            },
            Func: {
                match: /\s*(sin|cos)\s*/,
                eval: (text, match) => match[1],
            },
            Var: {
                match: /\s*([a-zA-Z]+)\s*/,
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
                    eval: ([l, op, r], c) => addOp(c, "add", l, r),
                },
                {
                    parts: ["Exp", "Sub", "Term"],
                    eval: ([l, op, r], c) => addOp(c, "sub", l, r),
                },
                {parts: ["Add", "Term"], eval: ([op, r]) => r},
                {parts: ["Sub", "Term"], eval: ([op, r], c) => addOp(c, "negate", r)},
                {parts: ["Term"], eval: ([v]) => v},
            ],
            Term: [
                {
                    parts: ["Term", "Mul", "Factor"],
                    eval: ([l, op, r], c) => addOp(c, "mul", l, r),
                },
                {
                    parts: ["Term", "Factor"],
                    eval: ([l, r], c) => addOp(c, "mul", l, r),
                },
                {
                    parts: ["Term", "Div", "Factor"],
                    eval: ([l, op, r], c) => addOp(c, "div", l, r),
                },
                {parts: ["Factor"], eval: ([v]) => v},
            ],
            Factor: [
                {
                    parts: ["Factor", "Pow", "Primary"],
                    eval: ([l, op, r], c) => addOp(c, "pow", l, r),
                },
                {
                    parts: ["Func", "Exp"],
                    eval: ([func, l], c) => addOp(c, func, l),
                },
                {parts: ["Primary"], eval: ([v]) => v},
            ],
            Primary: [
                {parts: ["LParen", "Exp", "RParen"], eval: ([lp, n, rp]) => n},
                {parts: ["Num"], eval: ([v], c) => addOp(c, "val", v)},
                {parts: ["Var"], eval: ([v], c) => addOp(c, "var", v)},
            ],

            Executer: [
                {
                    parts: ["Exp"],
                    eval: ([], {result: exp}) => ({
                        expression: exp,
                        evaluate: (variables: Variables) => execute(exp, variables), // not used in demo
                        evaluateInterval: (variables: Variables) =>
                            executeInterval(exp, variables),
                    }),
                },
            ],
        },
    },
    "Executer"
);

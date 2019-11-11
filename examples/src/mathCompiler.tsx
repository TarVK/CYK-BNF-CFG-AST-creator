import {Interpreter} from "CYK-BNF-CFG-AST-creator";

/** A single operation of an expression */
type Operation = {
    type: "val" | "var" | "negate" | "add" | "sub" | "mul" | "div" | "pow";
    [operants: number]: number;
};
/** The format that our compiled expression will have */
type Expression = Operation[];

/** The format for input variables for an expression */
type Variables = {[variable: string]: number};

/**
 * A function that evaluates a given expression to provide a result
 * @param expression The expression to evaluate
 * @param variables The variables to evaluate the expression with
 * @returns The result of the expression
 */
const evaluate = (expression: Expression, variables: Variables): number => {
    const result = [];
    for (let i = 0; i < expression.length; i++) {
        const op = expression[i];
        const {type, 0: l, 1: r} = op;

        // Perform the operation corresponding with the given type
        if (type == "val") result.push(l);
        else if (type == "var") result.push(variables[l]);
        else if (type == "negate") result.push(-result[l]);
        else if (type == "add") result.push(result[l] + result[r]);
        else if (type == "sub") result.push(result[l] - result[r]);
        else if (type == "mul") result.push(result[l] * result[r]);
        else if (type == "div") result.push(result[l] / result[r]);
        else if (type == "pow") result.push(Math.pow(result[l], result[r]));
    }

    return result[result.length - 1];
};

// Adds an operation to the context's operations array (uses the fact that tree walk performs a depth first walk)
const addOp = (context, type, ...children) => {
    let result = context.result;
    if (!context.result) result = context.result = [];
    result.push({type: type, ...children});
    return result.length - 1;
};

const mathCompiler = new Interpreter<any, any>(
    {
        tokenizer: {
            Num: {
                match: /\s*([0-9]*\.)?[0-9]+\s*/,
                eval: text => Number(text),
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
                        evaluate: (variables: Variables) => evaluate(exp, variables),
                    }),
                },
            ],
        },
    },
    "Executer"
);

const expression = mathCompiler.evaluate("30-5a+(2^2)b");
console.log(expression);
console.log(expression.evaluate({a: 7, b: 2}));

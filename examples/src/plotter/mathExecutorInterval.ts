import {Expression, Variables} from "./mathExecutor";
import {Interval} from "./Plotter";

/**
 * A function that evaluates a given expression to provide a result, using interval arithmetic
 * @param expression The expression to evaluate
 * @param variables The variables to evaluate the expression with
 * @returns The result of the expression
 */
export const executeInterval = (expression: Expression, variables: Variables): number => {
    const result = [];
    for (let i = 0; i < expression.length; i++) {
        const op = expression[i];
        const {type, 0: l, 1: r} = op;

        // Perform the operation corresponding with the given type
        if (type == "val") result.push({lo: l, hi: l});
        else if (type == "var")
            result.push(
                variables[l]
                    ? (variables[l] as any) instanceof Object
                        ? variables[l]
                        : {lo: variables[l], hi: variables[l]}
                    : {lo: 0, hi: 0}
            );
        else if (type == "negate") result.push({lo: -result[l].hi, hi: -result[l].lo});
        else if (type == "add")
            result.push({
                lo: result[l].lo + result[r].lo,
                hi: result[l].hi + result[r].hi,
            });
        else if (type == "sub")
            result.push({
                lo: result[l].lo - result[r].hi,
                hi: result[l].hi - result[r].lo,
            });
        else if (type == "mul")
            result.push(comb(result[l], result[r], (v1, v2) => v1 * v2));
        else if (type == "div")
            result.push(
                comb(
                    result[l],
                    {lo: 1 / result[r].lo, hi: 1 / result[r].hi},
                    (v1, v2) => v1 * v2
                )
            );
        else
            throw Error(
                "Only addition, subtraction, multiplication and division are supported"
            );
    }

    return result[result.length - 1];
};

/**
 * Finds the interval of a simple operation (add, sub, mul, div) applied to two inputs
 * @param v1 The first input interval
 * @param v2 The second input interval
 * @param op The operation
 * @returns The resulting interval
 */
const comb = (v1: Interval, v2: Interval, op) => {
    const vals = [op(v1.lo, v2.lo), op(v1.hi, v2.lo), op(v1.lo, v2.hi), op(v1.hi, v2.hi)];
    return {lo: Math.min(...vals), hi: Math.max(...vals)};
};

/** A single operation of an expression */
type Operation = {
    type: "val" | "var" | "negate" | "add" | "sub" | "mul" | "div" | "pow";
    [operants: number]: number;
};
/** The format that our compiled expression will have */
export type Expression = Operation[];

/** The format for input variables for an expression */
export type Variables = {[variable: string]: number};

/**
 * A function that evaluates a given expression to provide a result
 * @param expression The expression to evaluate
 * @param variables The variables to evaluate the expression with
 * @returns The result of the expression
 */
export const execute = (expression: Expression, variables: Variables): number => {
    const result = [];
    for (let i = 0; i < expression.length; i++) {
        const op = expression[i];
        const {type, 0: l, 1: r} = op;

        // Perform the operation corresponding with the given type
        if (type == "val") result.push(l);
        else if (type == "var") result.push(variables[l] || 0);
        else if (type == "negate") result.push(-result[l]);
        else if (type == "add") result.push(result[l] + result[r]);
        else if (type == "sub") result.push(result[l] - result[r]);
        else if (type == "mul") result.push(result[l] * result[r]);
        else if (type == "div") result.push(result[l] / result[r]);
        else if (type == "pow") result.push(Math.pow(result[l], result[r]));
        else if (type == "sin") result.push(Math.sin(result[l]));
        else if (type == "cos") result.push(Math.sin(result[l]));
    }

    return result[result.length - 1];
};

// The evaluator below operates on intervals. It's not very important to understand it,
// It's there to work with the implicit formula evaluation of function-plot

const p = (v1, v2, op) => {
    const vals = [op(v1.lo, v2.lo), op(v1.hi, v2.lo), op(v1.lo, v2.hi), op(v1.hi, v2.hi)];
    return {lo: Math.min(...vals), hi: Math.max(...vals)};
};

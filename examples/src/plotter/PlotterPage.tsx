import React, {useState, useCallback, useRef, useEffect} from "react";
import {Input, Box, Button, H2, Select, Option} from "@deity/falcon-ui";
import {mathCompiler} from "./mathCompiler";
import {Plotter, Interval} from "./Plotter";
import {Variables, Expression} from "./mathExecutor";

export const PlotterPage = () => {
    const updatePlot = useRef(null as () => void);
    const [state, setState] = useState({
        formulaText: "x*x + y*y - 1",
        formula: null as {
            expression: Expression;
            evaluate: (variables: Variables) => number;
        },
        function: (data: {x: Interval}) => ({lo: 0, hi: 0}),
        error: null as string,
    });
    useEffect(() => updatePlot.current(), []);

    // Updates the tree
    updatePlot.current = () => {
        let {formulaText} = state;

        const result = mathCompiler.evaluate(formulaText);
        if ("error" in result)
            setState(data => ({
                ...data,
                formula: null,
                error: "Syntax error, only +, -, * and / are supported",
                function: () => ({lo: 0, hi: 0}),
            }));
        else {
            try {
                // Check if we didn't use unssuported ops
                result.evaluateInterval({lo: 0, hi: 0});
                // Store the data
                setState(data => ({
                    ...data,
                    formula: result,
                    error: null,
                    function: result.evaluateInterval,
                }));
            } catch (e) {
                // If an error was thrown
                setState(data => ({
                    ...data,
                    formula: null,
                    error: "Syntax error, only +, -, * and / are supported",
                    function: () => ({lo: 0, hi: 0}),
                }));
            }
        }
    };
    const handleKeyDown = event => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if (
            ((event.ctrlKey || event.metaKey) && charCode === "s") ||
            event.keyCode == 13
        ) {
            event.preventDefault();
            updatePlot.current();
        }
    };

    return (
        <Box css={{height: "100%", overflow: "hidden"}}>
            <Box display="flex">
                <Input
                    flex={1}
                    placeholder="Your formula"
                    css={({theme}) => ({
                        fontFamily: theme.fonts.mono,
                        fontSize: 40,
                    })}
                    onKeyDown={handleKeyDown}
                    value={state.formulaText}
                    onChange={e => {
                        const formulaText = e.target.value;
                        setState(d => ({...d, formulaText}));
                    }}
                />
                <Button css={{fontSize: 40, height: "auto"}} onClick={updatePlot.current}>
                    Update
                </Button>
            </Box>
            <Box
                css={{height: "calc(100% - 70px)", div: {height: "100%", width: "100%"}}}>
                {state.error ? (
                    <Box p="md" css={{color: "red"}}>
                        {state.error}
                    </Box>
                ) : (
                    <Plotter
                        type={
                            state.formula &&
                            state.formula.expression.reduce(
                                (c, v) => c || (v.type == "var" && (v as any)[0] == "y"),
                                false
                            )
                                ? "implicit"
                                : "linear"
                        }
                        func={state.function}
                    />
                )}
            </Box>
        </Box>
    );
};

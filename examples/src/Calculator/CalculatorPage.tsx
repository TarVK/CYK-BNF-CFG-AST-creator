import React, {useState, useCallback, useRef, useEffect} from "react";
import {Input, Box, Button, H2, Select, Option} from "@deity/falcon-ui";
import {mathInterpreter} from "./mathInterpreter";

export const CalculatorPage = () => {
    const [history, setHistory] = useState(
        [] as {id: number; input: string; formula: string; error: string}[]
    );
    const [input, setInput] = useState({text: "", historyIndex: 1, buffer: ""});

    const evaluate = () => {
        const result = mathInterpreter.evaluate(input.text);

        const id = Math.random();
        let line;
        if (typeof result == "object")
            line = {id, input: input.text, formula: input.text, error: true};
        else
            line = {
                id,
                input: input.text,
                formula: `${input.text} = ${result}`,
                error: false,
            };

        setInput({text: "", historyIndex: history.length + 1, buffer: ""});
        setHistory(history => [...history, line]);
    };

    const handleKeyDown = event => {
        if (event.keyCode == 13) {
            // enter
            event.preventDefault();
            evaluate();
        } else if (event.keyCode == 38) {
            // up
            event.preventDefault();
            setInput(input => {
                if (input.historyIndex == 0 || history.length == 0) return input;
                let buffer = input.buffer;
                if (input.historyIndex == history.length) buffer = input.text;
                return {
                    buffer,
                    historyIndex: input.historyIndex - 1,
                    text: history[input.historyIndex - 1].input,
                };
            });
        } else if (event.keyCode == 40) {
            // down
            event.preventDefault();
            setInput(input => {
                if (input.historyIndex == history.length || history.length == 0)
                    return input;
                let text;
                if (input.historyIndex == history.length - 1) text = input.buffer;
                else text = history[input.historyIndex + 1].input;
                return {
                    buffer: input.buffer,
                    historyIndex: input.historyIndex + 1,
                    text,
                };
            });
        }
    };

    return (
        <Box css={{height: "100%", overflow: "auto"}}>
            {history.map(line => (
                <Box key={line.id} p="sm" css={{fontSize: 30}} display="flex">
                    <Box flex={1}>{line.formula}</Box>
                    {line.error && <Box css={{color: "red"}}>Invalid expression</Box>}
                </Box>
            ))}
            <Box display="flex">
                <Input
                    flex={1}
                    placeholder="Enter an expression"
                    css={({theme}) => ({
                        fontFamily: theme.fonts.mono,
                        fontSize: 40,
                    })}
                    onKeyDown={handleKeyDown}
                    value={input.text}
                    onChange={e => {
                        const text = e.target.value;
                        setInput(inp => ({...inp, text}));
                    }}
                />
                <Button css={{fontSize: 40, height: "auto"}} onClick={evaluate}>
                    Evaluate
                </Button>
            </Box>
        </Box>
    );
};

import React, {useState, useCallback, useRef, useEffect} from "react";
import {BNFTree} from "./BNFTree";
import {Input, Box, Button, H2, Select, Option} from "@deity/falcon-ui";
import {BNF} from "CYK-BNF-CFG-AST-creator";
import {bnfExample} from "./examples/bnf";
import {mathOrderedExample} from "./examples/mathOrdered";
import {mathFlatExample} from "./examples/mathFlat";

const examples = [mathOrderedExample, mathFlatExample, bnfExample];

export const BNFPage = () => {
    const updateTree = useRef(null as () => void);
    const [bnfData, setBnfData] = useState({
        definition: "",
        bnf: null as BNF,
        error: null as string,
    });
    const [inputData, setInputData] = useState({
        text: "",
        tree: {},
        error: null as string,
    });

    // Updates the tree
    updateTree.current = () => {
        let {definition, bnf} = bnfData;
        // Create the bnf if not present
        if (!bnf)
            try {
                bnf = new BNF(definition);
                setBnfData(data => ({...data, bnf, error: null}));
            } catch (e) {
                setBnfData(data => ({
                    ...data,
                    bnf: null,
                    error: "The given BNF contains an error",
                }));
                return;
            }

        // Create the tree
        const result =
            inputData.text.length == 0
                ? {error: true}
                : bnf.createASTtree(inputData.text);
        if ("error" in result)
            setInputData(data => ({
                ...data,
                tree: {},
                error: "The given input string doesn't adhere to the defined bnf",
            }));
        else setInputData(data => ({...data, tree: result, error: null}));
    };

    const updateBnfDefinition = definition => {
        setBnfData(data => ({...data, bnf: null, definition}));
    };

    const selectExample = index => {
        const example = examples[index];
        setInputData(data => ({...data, text: example.input}));
        updateBnfDefinition(example.bnf);
        setTimeout(() => updateTree.current(), 100);
    };
    useEffect(() => selectExample(0), []);

    const handleKeyDown = event => {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if (
            ((event.ctrlKey || event.metaKey) && charCode === "s") ||
            (event.shiftKey && event.keyCode == 13)
        ) {
            event.preventDefault();
            updateTree.current();
        }
    };

    return (
        <Box css={{height: "100%"}}>
            <Box
                px="sm"
                bg="secondary"
                css={{height: "50px"}}
                display="flex"
                justifyContent="space-between">
                <H2>Backus–Naur form (BNF) syntax tree creator</H2>
                <Box
                    pl="md"
                    display="flex"
                    alignItems="center"
                    flex={1}
                    css={{maxWidth: 300}}>
                    <Box pr="xs">Example:</Box>
                    <Select bg="white" onChange={e => selectExample(e.target.value)}>
                        {examples.map((example, i) => (
                            <Option key={i} value={i}>
                                {example.name}
                            </Option>
                        ))}
                    </Select>
                </Box>
            </Box>
            <Box display="flex" css={{height: "30%"}} flex={1}>
                <Box display="flex" flexDirection="column" flex={1}>
                    <Input
                        flex={1}
                        as="textarea"
                        placeholder="Your BNF grammar definition"
                        css={({theme}) => ({
                            fontFamily: theme.fonts.mono,
                            resize: "none",
                        })}
                        onKeyDown={handleKeyDown}
                        value={bnfData.definition}
                        onChange={(e: any) => updateBnfDefinition(e.target.value)}
                    />
                    {bnfData.error && (
                        <Box p="md" css={{color: "red"}}>
                            {bnfData.error}
                        </Box>
                    )}
                </Box>
                <Box display="flex" flexDirection="column" flex={1}>
                    <Input
                        flex={1}
                        as="textarea"
                        placeholder="Input to your grammar"
                        css={({theme}) => ({
                            fontFamily: theme.fonts.mono,
                            resize: "none",
                        })}
                        onKeyDown={handleKeyDown}
                        value={inputData.text}
                        onChange={(e: any) => {
                            const text = e.target.value;
                            setInputData(data => ({...data, text}));
                        }}
                    />
                    {inputData.error && (
                        <Box p="md" css={{color: "red"}}>
                            {inputData.error}
                        </Box>
                    )}
                </Box>
            </Box>
            <Box css={{height: "calc(70% - 50px)"}}>
                <Box css={{position: "absolute"}} pl="sm" pt="sm">
                    <Button onClick={updateTree.current}>Refresh tree</Button>
                </Box>
                <BNFTree data={inputData.tree} />
            </Box>
        </Box>
    );
};

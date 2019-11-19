import React from "react";
import ReactDOM from "react-dom";
import {HashRouter, Route, Switch} from "react-router-dom";
import {BNFPage} from "./BNF/BNFPage";
import {ThemeProvider} from "emotion-theming";
import {customizedTheme} from "./theme";
import {Box} from "@deity/falcon-ui";
import {PlotterPage} from "./plotter/PlotterPage";
import {CalculatorPage} from "./Calculator/CalculatorPage";
import {Tokenizer, CFG, CNF, BNF, Interpreter} from "CYK-BNF-CFG-AST-creator";

ReactDOM.render(
    <ThemeProvider theme={customizedTheme}>
        <Box css={({theme}) => ({fontFamily: theme.fonts.mono})}>
            <HashRouter>
                <Switch>
                    <Route exact path="/BNF">
                        <BNFPage />
                    </Route>
                    <Route exact path="/plotter">
                        <PlotterPage />
                    </Route>
                    <Route exact path="/calculator">
                        <CalculatorPage />
                    </Route>
                    <Route path="/">
                        <BNFPage />
                    </Route>
                </Switch>
            </HashRouter>
        </Box>
    </ThemeProvider>,
    document.getElementById("root")
);

// For testing
window["Tokenizer"] = Tokenizer;
window["CFG"] = CFG;
window["CNF"] = CNF;
window["BNF"] = BNF;
window["Interpreter"] = Interpreter;

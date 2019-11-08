import {CNF} from "CYK-BNF-CFG-AST-creator";

window["CNF"] = CNF;

// create some test CNF
const someCNF = new CNF({
    H: [{left: "B", right: "J"}],
    I: [{left: "H", right: "C"}],
    J: [
        {left: "J", right: "K"},
        {left: "J", right: "L"},
        {left: "J", right: "M"},
        {left: "J", right: "N"},
        {left: "I", right: "K"},
        {left: "I", right: "L"},
        {left: "I", right: "M"},
        {left: "I", right: "N"},
        {left: "A", right: "K"},
        {left: "A", right: "L"},
        {left: "A", right: "M"},
        {left: "A", right: "N"},
    ],
    K: [{left: "D", right: "J"}, {left: "D", right: "I"}, {left: "D", right: "A"}],
    L: [{left: "E", right: "J"}, {left: "E", right: "I"}, {left: "E", right: "A"}],
    M: [{left: "F", right: "J"}, {left: "F", right: "I"}, {left: "F", right: "A"}],
    N: [{left: "G", right: "J"}, {left: "G", right: "I"}, {left: "G", right: "A"}],
});

window["someCNF"] = someCNF;
window["someInput"] = ["F", "A", "D", "B", "A", "F", "A", "C", "E", "A", "G", "A"];

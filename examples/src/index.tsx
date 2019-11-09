import {CNF, CFG, Tokenizer} from "CYK-BNF-CFG-AST-creator";

window["CNF"] = CNF;

// create some test CNF
window["someCNF"] = new CNF(
    {
        H: [{left: "B", right: "J"}],
        I: [{left: "H", right: "C"}],
        J: [
            {left: "K", right: "J"},
            {left: "L", right: "J"},
            {left: "M", right: "J"},
            {left: "N", right: "J"},
            {left: "K", right: "I"},
            {left: "L", right: "I"},
            {left: "M", right: "I"},
            {left: "N", right: "I"},
            {left: "K", right: "A"},
            {left: "L", right: "A"},
            {left: "M", right: "A"},
            {left: "N", right: "A"},
        ],
        K: [{left: "J", right: "D"}, {left: "I", right: "D"}, {left: "A", right: "D"}],
        L: [{left: "J", right: "E"}, {left: "I", right: "E"}, {left: "A", right: "E"}],
        M: [{left: "J", right: "F"}, {left: "I", right: "F"}, {left: "A", right: "F"}],
        N: [{left: "J", right: "G"}, {left: "I", right: "G"}, {left: "A", right: "G"}],
    },
    "J"
);

window["someInput"] = [
    {symbol: "A", text: "1343", range: {start: 0, end: 3}},
    {symbol: "D", text: "*", range: {start: 4, end: 4}},
    {symbol: "B", text: "(", range: {start: 5, end: 5}},
    {symbol: "A", text: "12", range: {start: 6, end: 7}},
    {symbol: "F", text: "-", range: {start: 8, end: 8}},
    {symbol: "A", text: "35", range: {start: 9, end: 10}},
    {symbol: "C", text: ")", range: {start: 11, end: 11}},
    {symbol: "E", text: "/", range: {start: 12, end: 12}},
    {symbol: "A", text: "23", range: {start: 13, end: 15}},
    {symbol: "G", text: "+", range: {start: 16, end: 16}},
    {symbol: "A", text: "7", range: {start: 17, end: 17}},
];
// window["someInput"] = [
//     {symbol: "A", text: "1343", range: {start: 0, end: 3}},
//     {symbol: "D", text: "*", range: {start: 4, end: 4}},
//     {symbol: "B", text: "(", range: {start: 5, end: 5}},
//     {symbol: "A", text: "12", range: {start: 6, end: 7}},
//     {symbol: "F", text: "-", range: {start: 8, end: 8}},
//     {symbol: "A", text: "35", range: {start: 9, end: 10}},
//     {symbol: "A", text: "3", range: {start: 11, end: 11}},
//     {symbol: "E", text: "/", range: {start: 12, end: 12}},
//     {symbol: "A", text: "23", range: {start: 13, end: 15}},
//     {symbol: "G", text: "+", range: {start: 16, end: 16}},
//     {symbol: "A", text: "7", range: {start: 17, end: 17}},
// ];

window["someTokenizer"] = new Tokenizer({
    Num: /\s*([0-9]*\.)?[0-9]+\s*/,
    Mul: /\*/,
    Div: /\//,
    Add: /\+/,
    Sub: /\-/,
    Pow: /\^/,
    LParen: /\s*\(/,
    RParen: /\)\s*/,
});
window["someCFG"] = new CFG(
    {
        Exp: [
            {parts: ["Exp", "AddOp", "Term"]},
            {parts: ["AddOp", "Term"]},
            {parts: ["Term"]},
        ],
        Term: [{parts: ["Term", "MulOp", "Factor"]}, {parts: ["Factor"]}],
        Factor: [{parts: ["Factor", "Pow", "Primary"]}, {parts: ["Primary"]}],
        Primary: [{parts: ["LParen", "Exp", "RParen"]}, {parts: ["Num"]}],
        AddOp: [{parts: ["Add"]}, {parts: ["Sub"]}],
        MulOp: [{parts: ["Mul"]}, {parts: ["Div"]}],
    },
    "Exp"
);

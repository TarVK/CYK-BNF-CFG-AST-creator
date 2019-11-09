(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["library"] = factory();
	else
		root["library"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/CFG.ts":
/*!********************!*\
  !*** ./src/CFG.ts ***!
  \********************/
/*! exports provided: CFG */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CFG\", function() { return CFG; });\n/* harmony import */ var _CNF__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CNF */ \"./src/CNF.ts\");\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\n\r\nvar s = 0;\r\n/** Generates a new symbol */\r\nvar g = function () { return s++ + \"\"; };\r\nvar CFG = /** @class */ (function () {\r\n    /**\r\n     * Creates a new instance\r\n     * @param grammar The grammmar to create an instance for\r\n     * @param startSymbol The symbol that a matched string should have\r\n     */\r\n    function CFG(grammar, startSymbol) {\r\n        this.grammar = grammar;\r\n        this.startSymbol = startSymbol;\r\n        this.CNF = this.createCNF(grammar, startSymbol);\r\n    }\r\n    /**\r\n     * Creates a CNF grammar representing the given BNF grammar\r\n     * @param grammar The base BNF grammar\r\n     * @param startSymbol The start symbol\r\n     * @returns The CNF grammar representing the BNF grammar\r\n     */\r\n    CFG.prototype.createCNF = function (grammar, startSymbol) {\r\n        var cfg = this.copyCFG(grammar);\r\n        // Conversion as described in  https://en.wikipedia.org/wiki/Chomsky_normal_form#Converting_a_grammar_to_Chomsky_normal_form\r\n        // Some steps that don't apply to our representation are skipped\r\n        // BIN\r\n        var symbols = Object.keys(cfg);\r\n        for (var i = 0; i < symbols.length; i++) {\r\n            var symbol = symbols[i];\r\n            var options = cfg[symbol];\r\n            // Split all patterns with more than 2 parts\r\n            cfg[symbol] = options.map(function (pattern) {\r\n                if (pattern.parts.length > 2) {\r\n                    var newSymbol = g();\r\n                    cfg[newSymbol] = [\r\n                        __assign(__assign({}, pattern), { metaData: __assign(__assign({}, pattern.metaData), { partNames: pattern.metaData.partNames.slice(0, pattern.parts.length - 1) }), parts: pattern.parts.slice(0, pattern.parts.length - 1) }),\r\n                    ];\r\n                    symbols.push(newSymbol);\r\n                    return __assign(__assign({}, pattern), { metaData: __assign(__assign({}, pattern.metaData), { partNames: [\r\n                                newSymbol,\r\n                                pattern.metaData.partNames[pattern.parts.length - 1],\r\n                            ] }), parts: [newSymbol, pattern.parts[pattern.parts.length - 1]] });\r\n                }\r\n                return pattern;\r\n            });\r\n        }\r\n        var _loop_1 = function (i) {\r\n            var symbol = symbols[i];\r\n            var options = cfg[symbol];\r\n            for (var j = 0; j < options.length && j < 1e4; j++) {\r\n                var pattern = options[j];\r\n                if (pattern.parts.length == 1) {\r\n                    // Add the definitions of the part\r\n                    var part = pattern.parts[0];\r\n                    var copyOptions = cfg[part];\r\n                    // Make sure this isn't a terminale symbol\r\n                    if (copyOptions) {\r\n                        copyOptions.forEach(function (option) { return options.push(option); });\r\n                        // Remove the option\r\n                        options.splice(j, 1);\r\n                        j--;\r\n                    }\r\n                }\r\n            }\r\n        };\r\n        // UNIT\r\n        for (var i = 0; i < symbols.length; i++) {\r\n            _loop_1(i);\r\n        }\r\n        // Convert the grammar to CNF\r\n        var cnf = {};\r\n        for (var i = 0; i < symbols.length; i++) {\r\n            var symbol = symbols[i];\r\n            var options = cfg[symbol];\r\n            cnf[symbol] = options.map(function (pattern) { return (__assign({ left: pattern.parts[0], right: pattern.parts[1], metaData: pattern.metaData }, (pattern.rightRecursive && { rightRecursive: pattern.rightRecursive }))); });\r\n        }\r\n        return new _CNF__WEBPACK_IMPORTED_MODULE_0__[\"CNF\"](cnf, startSymbol);\r\n    };\r\n    /**\r\n     * Deep copies and normalizes the given grammar, also transforms the metadata\r\n     * @param grammar The grammar to copy\r\n     * @returns A copy of the grammar\r\n     */\r\n    CFG.prototype.copyCFG = function (grammar) {\r\n        var _this = this;\r\n        var cfg = {};\r\n        Object.keys(grammar).forEach(function (symbol) {\r\n            var def = grammar[symbol];\r\n            // Normalize the options format\r\n            var options;\r\n            if (def instanceof Array) {\r\n                options = def.map(function (pattern) { return _this.copyPattern(pattern); });\r\n            }\r\n            else if (\"options\" in def) {\r\n                options = def.options.map(function (pattern) { return _this.copyPattern(pattern); });\r\n            }\r\n            else {\r\n                options = [_this.copyPattern(def)];\r\n            }\r\n            // Store the definition with the original definition as metadata\r\n            cfg[symbol] = options;\r\n        });\r\n        return cfg;\r\n    };\r\n    /**\r\n     * Deep copies and normalizes the given pattern\r\n     * @param pattern The pattern to copy\r\n     * @param definition The definiition that this pattern was part of\r\n     * @returns A copy of the pattern\r\n     */\r\n    CFG.prototype.copyPattern = function (pattern) {\r\n        return {\r\n            rightRecursive: pattern.rightRecursive,\r\n            metaData: {\r\n                partNames: pattern.parts.map(function (part, i) {\r\n                    return part instanceof Object ? Object.keys(part)[0] : i + \"\";\r\n                }),\r\n                pattern: pattern,\r\n            },\r\n            parts: pattern.parts.map(function (part, i) {\r\n                return part instanceof Object ? part[Object.keys(part)[0]] : part;\r\n            }),\r\n        };\r\n    };\r\n    /**\r\n     * Creates a AST tree from a given input of lexical tokens\r\n     * @param input The input\r\n     */\r\n    CFG.prototype.createASTtree = function (input) {\r\n        // Parse the tree using CNF\r\n        var binaryTree = this.CNF.getBinaryTree(input);\r\n        if (\"error\" in binaryTree)\r\n            return binaryTree;\r\n        // Merge nodes to be in the same structure as the original CFG\r\n        var c = function (node) { return ({\r\n            node: null,\r\n            cnfNode: node,\r\n            left: null,\r\n            right: null,\r\n        }); };\r\n        var stack = [c(binaryTree)];\r\n        var _loop_2 = function () {\r\n            var top_1 = stack[stack.length - 1];\r\n            var cnfNode = top_1.cnfNode;\r\n            // Check whether this is a base token\r\n            if (!(\"left\" in cnfNode)) {\r\n                stack.pop();\r\n                top_1.node = cnfNode;\r\n                if (stack.length == 0)\r\n                    return { value: top_1.node };\r\n            }\r\n            else {\r\n                // Check whether the item was just pushed to the stack, of all children were just popped\r\n                if (!top_1.left) {\r\n                    // Push the left and right children onto the stack\r\n                    var left = (top_1.left = c(cnfNode.left));\r\n                    var right = (top_1.right = c(cnfNode.right));\r\n                    stack.push(left, right);\r\n                }\r\n                else {\r\n                    // Pop the stack item and assemble the node using its children\r\n                    stack.pop();\r\n                    var childrenStack = [top_1.left, top_1.right];\r\n                    var children_1 = {};\r\n                    // Handle both left and right children the same\r\n                    for (var i = 0; i < 2; i++) {\r\n                        var child = childrenStack[i];\r\n                        // Check if the symbol is part of our grammar\r\n                        if (this_1.grammar[child.node.symbol] ||\r\n                            !(\"children\" in child.node)) {\r\n                            // If so, just store the child under the given name\r\n                            children_1[cnfNode.pattern.metaData.partNames[i]] = child.node;\r\n                        }\r\n                        else {\r\n                            // Otherwise, merge the childs children\r\n                            Object.assign(children_1, child.node.children);\r\n                        }\r\n                    }\r\n                    // Sort the children\r\n                    var childList = Object.keys(children_1).map(function (name) { return children_1[name]; });\r\n                    childList.sort(function (a, b) { return a.range.start - b.range.start; });\r\n                    // Assemble the node\r\n                    var rs = childList[0].range.start;\r\n                    var re = childList[childList.length - 1].range.end;\r\n                    var text = childList.reduce(function (a, b) { return a + b.text; }, \"\");\r\n                    top_1.node = {\r\n                        children: children_1,\r\n                        range: { start: rs, end: re },\r\n                        text: text,\r\n                        pattern: cnfNode.pattern.metaData.pattern,\r\n                        symbol: cnfNode.symbol,\r\n                    };\r\n                    if (stack.length == 0)\r\n                        return { value: top_1.node };\r\n                }\r\n            }\r\n        };\r\n        var this_1 = this;\r\n        while (stack.length > 0) {\r\n            var state_1 = _loop_2();\r\n            if (typeof state_1 === \"object\")\r\n                return state_1.value;\r\n        }\r\n    };\r\n    return CFG;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://library/./src/CFG.ts?");

/***/ }),

/***/ "./src/CNF.ts":
/*!********************!*\
  !*** ./src/CNF.ts ***!
  \********************/
/*! exports provided: CNF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CNF\", function() { return CNF; });\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\n/**\r\n * A class to represent a CNF grammar, and allows for creation of a binary tree from a token array\r\n */\r\nvar CNF = /** @class */ (function () {\r\n    /**\r\n     * Creates a new instance\r\n     * @param grammar The grammmar to create an instance for\r\n     * @param startSymbol The symbol that a matched string should have\r\n     */\r\n    function CNF(grammar, startSymbol) {\r\n        this.grammar = grammar;\r\n        this.startSymbol = startSymbol;\r\n        this.lookupTable = this.createLookupTable(grammar);\r\n    }\r\n    /**\r\n     * Creates a lookup table for the grammar\r\n     * @param grammar The grammar to create a lookup table for\r\n     * @returns The lookup table for a given grammar\r\n     */\r\n    CNF.prototype.createLookupTable = function (grammar) {\r\n        var lookup = {};\r\n        /**\r\n         * Given a CNF:\r\n         * ```js\r\n         * {\r\n         *   A:[{left:\"C\", right:\"D\"}],\r\n         *   B:[{left:\"D\", right:\"D\"}, {left:\"D\", right:\"E\"}]\r\n         * }\r\n         * ```\r\n         * Creates a lookup table:\r\n         * ```js\r\n         * {\r\n         *   C: {D: [{left:\"C\", right:\"D\", defSymbol:\"A\"}]},\r\n         *   D: {D: [{left:\"D\", right:\"D\", defSymbol:\"B\"}],\r\n         *       E: [{left:\"D\", right:\"E\", defSymbol:\"B\"}]}\r\n         * }\r\n         * ```\r\n         */\r\n        // Go through all definitions\r\n        Object.keys(grammar).forEach(function (symbol) {\r\n            var options = grammar[symbol];\r\n            // Go through the options of every definition\r\n            options.forEach(function (option) {\r\n                // Make sure an object exists to store all patterns that containt he left symbol\r\n                if (!lookup[option.left])\r\n                    lookup[option.left] = {};\r\n                // Make sure an object exists to store all the patterns that contain the left and right symbol\r\n                var leftMap = lookup[option.left];\r\n                if (!leftMap[option.right])\r\n                    leftMap[option.right] = [];\r\n                // Add the pattern to the map\r\n                var leftAndRightMap = leftMap[option.right];\r\n                leftAndRightMap.push(__assign(__assign({}, option), { defSymbol: symbol }));\r\n            });\r\n        });\r\n        return lookup;\r\n    };\r\n    /**\r\n     * Creates a CYk table given an input string\r\n     * @param input The input tokens\r\n     * @param approximate Whether to allow changing a right token to improve the match\r\n     * @returns The table\r\n     */\r\n    CNF.prototype.performCYK = function (input, approximate) {\r\n        // usage of re represents the column or range end, and rs the row or range start (as index of the token)\r\n        // Declare the table\r\n        var table = [];\r\n        for (var rs = 0; rs < input.length; rs++)\r\n            table[rs] = [];\r\n        for (var re = 0; re < input.length; re++) {\r\n            var _loop_1 = function (rs) {\r\n                var cell = (table[rs][re] = {\r\n                    symbols: [],\r\n                    definitions: [],\r\n                    range: { start: null, end: null },\r\n                });\r\n                // Initialize the value if it's on the diagonal\r\n                if (rs == re) {\r\n                    var s = input[rs].symbol;\r\n                    cell.symbols.push(s);\r\n                    var t = this_1.lookupTable[s];\r\n                    if (t && t[\"undefined\"])\r\n                        t[\"undefined\"].forEach(function (symbol) {\r\n                            return cell.symbols.push(symbol.defSymbol);\r\n                        });\r\n                    cell.range = input[rs].range;\r\n                }\r\n                else {\r\n                    cell.range.start = table[rs][rs].range.start;\r\n                    cell.range.end = table[re][re].range.end;\r\n                }\r\n            };\r\n            var this_1 = this;\r\n            for (var rs = re; rs >= 0; rs--) {\r\n                _loop_1(rs);\r\n            }\r\n        }\r\n        // Fill the table (skipping the diagonal since that's already initialized)\r\n        for (var re = 1; re < input.length; re++) {\r\n            for (var rs = re - 1; rs >= 0; rs--) {\r\n                var cell = table[rs][re];\r\n                // Go through all the options for combining subparts\r\n                for (var k = rs; k < re; k++) {\r\n                    // Get this option for left and right pair\r\n                    var left = table[rs][k];\r\n                    var right = table[k + 1][re];\r\n                    // Go through all combinations of left and right symbol options\r\n                    for (var lsI = 0; lsI < left.symbols.length; lsI++) {\r\n                        var leftSymbol = left.symbols[lsI];\r\n                        // Check the lookup to see if this fits a definition\r\n                        var leftDefs = this.lookupTable[leftSymbol];\r\n                        if (!leftDefs)\r\n                            continue;\r\n                        // Combine it with all the right options\r\n                        for (var rsI = 0; rsI < right.symbols.length; rsI++) {\r\n                            var rightSymbol = right.symbols[rsI];\r\n                            var defs = leftDefs[rightSymbol];\r\n                            if (!defs)\r\n                                continue;\r\n                            // Add all the definitions to the cell\r\n                            for (var defI = 0; defI < defs.length; defI++) {\r\n                                var def = defs[defI];\r\n                                if (!cell.symbols.includes(def.defSymbol))\r\n                                    cell.symbols.push(def.defSymbol);\r\n                                cell.definitions.push(__assign({ index: k }, def));\r\n                            }\r\n                        }\r\n                    }\r\n                }\r\n            }\r\n        }\r\n        // return the result\r\n        return table;\r\n    };\r\n    /**\r\n     * Retrieves the binary tree of some input\r\n     * @param input The input to construct a tree for\r\n     * @returns The tree\r\n     */\r\n    CNF.prototype.getBinaryTree = function (input) {\r\n        var _this = this;\r\n        // Obtain the table using CYK\r\n        var table = this.performCYK(input);\r\n        // Check if we matched the whole input with the required start symbol, and return an error otherwise\r\n        var re = input.length - 1;\r\n        table[0][re].symbols = table[0][re].symbols.filter(function (value) { return value == _this.startSymbol; });\r\n        if (table[0][re].symbols.length == 0)\r\n            return { error: true, table: table };\r\n        // Create a tree from this info\r\n        var c = function (rs, re) { return ({\r\n            cell: table[rs][re],\r\n            index: [rs, re],\r\n            node: null,\r\n            pattern: null,\r\n            left: null,\r\n            right: null,\r\n        }); };\r\n        var stack = [c(0, re)];\r\n        var _loop_2 = function () {\r\n            var top_1 = stack[stack.length - 1];\r\n            var cell = top_1.cell;\r\n            var _a = top_1.index, rs = _a[0], re_1 = _a[1];\r\n            // Check whether this is a base token, or combined token\r\n            if (rs == re_1) {\r\n                // Remove the item from the stack, and create the node\r\n                stack.pop();\r\n                top_1.node = input[rs];\r\n                if (stack.length == 0)\r\n                    return { value: top_1.node };\r\n            }\r\n            else {\r\n                // Check whether the item was just pushed to the stack, of all children were just popped\r\n                if (!top_1.left) {\r\n                    // Get the definition to use, and create the child items to add to the stack\r\n                    var definition = (top_1.pattern = cell.definitions.find(function (def, i) { return def.rightRecursive || i == cell.definitions.length - 1; }));\r\n                    var left = (top_1.left = c(rs, definition.index));\r\n                    var right = (top_1.right = c(definition.index + 1, re_1));\r\n                    stack.push(left, right);\r\n                }\r\n                else {\r\n                    // Pop the stack item, and assemble the node using the children\r\n                    stack.pop();\r\n                    var left = top_1.left.node;\r\n                    var right = top_1.right.node;\r\n                    top_1.node = {\r\n                        symbol: top_1.pattern.defSymbol,\r\n                        left: left,\r\n                        right: right,\r\n                        pattern: top_1.pattern,\r\n                        range: { start: left.range.start, end: right.range.end },\r\n                        text: left.text + right.text,\r\n                    };\r\n                    if (stack.length == 0)\r\n                        return { value: top_1.node };\r\n                }\r\n            }\r\n        };\r\n        while (stack.length > 0) {\r\n            var state_1 = _loop_2();\r\n            if (typeof state_1 === \"object\")\r\n                return state_1.value;\r\n        }\r\n    };\r\n    return CNF;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://library/./src/CNF.ts?");

/***/ }),

/***/ "./src/Tokenizer.ts":
/*!**************************!*\
  !*** ./src/Tokenizer.ts ***!
  \**************************/
/*! exports provided: Tokenizer */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Tokenizer\", function() { return Tokenizer; });\nvar Tokenizer = /** @class */ (function () {\r\n    /**\r\n     * Creates a tokenizer\r\n     * @param tokenizer The tokenizer data\r\n     */\r\n    function Tokenizer(tokenizer) {\r\n        this.tokenizer = Object.keys(tokenizer).map(function (symbol) { return [\r\n            symbol,\r\n            new RegExp(tokenizer[symbol], \"y\"),\r\n        ]; });\r\n    }\r\n    /**\r\n     * Tokenize the given input\r\n     * @param input\r\n     */\r\n    Tokenizer.prototype.tokenize = function (input) {\r\n        var tokens = [];\r\n        var index = 0;\r\n        outer: while (true) {\r\n            // Try all matchers\r\n            for (var i = 0; i < this.tokenizer.length; i++) {\r\n                var _a = this.tokenizer[i], symbol = _a[0], regex = _a[1];\r\n                regex.lastIndex = index;\r\n                var match = regex.exec(input);\r\n                // If a match was found, continue\r\n                if (match) {\r\n                    tokens.push({\r\n                        symbol: symbol,\r\n                        text: match[0],\r\n                        range: { start: index, end: index + match[0].length - 1 },\r\n                    });\r\n                    index += match[0].length;\r\n                    continue outer;\r\n                }\r\n            }\r\n            // If no match could be mage\r\n            if (index == input.length)\r\n                return tokens;\r\n            else\r\n                return { error: true, index: index };\r\n        }\r\n    };\r\n    return Tokenizer;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://library/./src/Tokenizer.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: Tokenizer, CFG, CNF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _CFG__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./CFG */ \"./src/CFG.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"CFG\", function() { return _CFG__WEBPACK_IMPORTED_MODULE_0__[\"CFG\"]; });\n\n/* harmony import */ var _CNF__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CNF */ \"./src/CNF.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"CNF\", function() { return _CNF__WEBPACK_IMPORTED_MODULE_1__[\"CNF\"]; });\n\n/* harmony import */ var _Tokenizer__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Tokenizer */ \"./src/Tokenizer.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Tokenizer\", function() { return _Tokenizer__WEBPACK_IMPORTED_MODULE_2__[\"Tokenizer\"]; });\n\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://library/./src/index.ts?");

/***/ })

/******/ });
});
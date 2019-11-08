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

/***/ "./src/BNF.ts":
/*!********************!*\
  !*** ./src/BNF.ts ***!
  \********************/
/*! exports provided: BNF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"BNF\", function() { return BNF; });\nvar BNF = /** @class */ (function () {\r\n    function BNF() {\r\n    }\r\n    return BNF;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://library/./src/BNF.ts?");

/***/ }),

/***/ "./src/CNF.ts":
/*!********************!*\
  !*** ./src/CNF.ts ***!
  \********************/
/*! exports provided: CNF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"CNF\", function() { return CNF; });\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\n/**\r\n * A class to represent a CNF grammar, and allows for creation of a binary tree from a token array\r\n */\r\nvar CNF = /** @class */ (function () {\r\n    /**\r\n     * Creates a new instance\r\n     * @param grammar The grammmar to create an instance for\r\n     */\r\n    function CNF(grammar) {\r\n        this.grammar = grammar;\r\n        this.lookupTable = this.createLookupTable(grammar);\r\n    }\r\n    /**\r\n     * Creates a lookup table for the grammar\r\n     * @param grammar The grammar to create a lookup table for\r\n     * @returns The lookup table for a given grammar\r\n     */\r\n    CNF.prototype.createLookupTable = function (grammar) {\r\n        var lookup = {};\r\n        /**\r\n         * Given a CNF:\r\n         * ```js\r\n         * {\r\n         *   A:[{left:\"C\", right:\"D\"}],\r\n         *   B:[{left:\"D\", right:\"D\"}, {left:\"D\", right:\"E\"}]\r\n         * }\r\n         * ```\r\n         * Creates a lookup table:\r\n         * ```js\r\n         * {\r\n         *   C: {D: [{left:\"C\", right:\"D\", defSymbol:\"A\"}]},\r\n         *   D: {D: [{left:\"D\", right:\"D\", defSymbol:\"B\"}],\r\n         *       E: [{left:\"D\", right:\"E\", defSymbol:\"B\"}]}\r\n         * }\r\n         * ```\r\n         */\r\n        // Go through all definitions\r\n        Object.keys(grammar).forEach(function (symbol) {\r\n            var definition = grammar[symbol];\r\n            // Go through the options of every definition\r\n            var options = definition instanceof Array ? definition : definition.options;\r\n            options.forEach(function (option) {\r\n                // Make sure an object exists to store all patterns that containt he left symbol\r\n                if (!lookup[option.left])\r\n                    lookup[option.left] = {};\r\n                // Make sure an object exists to store all the patterns that contain the left and right symbol\r\n                var leftMap = lookup[option.left];\r\n                if (!leftMap[option.right])\r\n                    leftMap[option.right] = [];\r\n                // Add the pattern to the map\r\n                var leftAndRightMap = (leftMap[option.right] = []);\r\n                leftAndRightMap.push(__assign(__assign({}, option), { defSymbol: symbol }));\r\n            });\r\n        });\r\n        return lookup;\r\n    };\r\n    /**\r\n     * Creates a CYk table given an input string\r\n     * @param input The input tokens\r\n     * @returns The table\r\n     */\r\n    CNF.prototype.performCYK = function (input) {\r\n        // Declare the table\r\n        var table = [];\r\n        for (var i = 0; i < input.length; i++) {\r\n            // i represents the column, and j the row\r\n            table[i] = [];\r\n            for (var j = 0; j <= i; j++) {\r\n                table[i][j] = { symbols: [], definitions: [] };\r\n                // Initialize the value if it's on the diagonal\r\n                if (i == j)\r\n                    table[i][j].symbols.push(input[i]);\r\n            }\r\n        }\r\n        // Fill the table (skipping the diagonal since that's already initialized)\r\n        for (var i = 1; i < input.length; i++) {\r\n            for (var j = i - 1; j >= 0; j--) {\r\n                var cell = table[i][j];\r\n                // Go through all the options for combining subparts\r\n                for (var k = j; k < i; k++) {\r\n                    var il = k;\r\n                    var jl = j - k + i; // starts at i, ends at j+1 in the loop\r\n                    // Get this option for left and right pair\r\n                    var left = table[il][j];\r\n                    var right = table[i][jl];\r\n                    // Go through all combinations of left and right symbol options\r\n                    for (var LSI = 0; LSI < left.symbols.length; LSI++) {\r\n                        var leftSymbol = left.symbols[LSI];\r\n                        // Check the lookup to see if this fits a definition\r\n                        var leftDefs = this.lookupTable[leftSymbol];\r\n                        if (!leftDefs)\r\n                            continue;\r\n                        // Combine it with all the right options\r\n                        for (var RSI = 0; RSI < right.symbols.length; RSI++) {\r\n                            var rightSymbol = right.symbols[RSI];\r\n                            var defs = leftDefs[rightSymbol];\r\n                            if (!defs)\r\n                                continue;\r\n                            // Add all the definitions to the cell\r\n                            for (var defI = 0; defI < defs.length; defI++) {\r\n                                var def = defs[defI];\r\n                                if (!cell.symbols.includes(def.defSymbol))\r\n                                    cell.symbols.push(def.defSymbol);\r\n                                cell.definitions.push(__assign({ index: k }, def));\r\n                            }\r\n                        }\r\n                    }\r\n                }\r\n            }\r\n        }\r\n        // return the result\r\n        return table;\r\n    };\r\n    /**\r\n     * Retrieves the binary tree of some input\r\n     * @param input The input to construct a tree for\r\n     * @returns The tree\r\n     */\r\n    CNF.prototype.getBinaryTree = function (input) {\r\n        return undefined;\r\n    };\r\n    return CNF;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://library/./src/CNF.ts?");

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: BNF, CNF */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _BNF__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./BNF */ \"./src/BNF.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"BNF\", function() { return _BNF__WEBPACK_IMPORTED_MODULE_0__[\"BNF\"]; });\n\n/* harmony import */ var _CNF__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./CNF */ \"./src/CNF.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"CNF\", function() { return _CNF__WEBPACK_IMPORTED_MODULE_1__[\"CNF\"]; });\n\n\r\n\r\n\n\n//# sourceURL=webpack://library/./src/index.ts?");

/***/ })

/******/ });
});
import { defineType } from "./manager";

// RegEx: Matches double quotes with any number of characters between them.
defineType("string", /".*"/, (str) => str.slice(1, -1));

// RegEx: Matches single quotes with one character between them.
defineType("char", /'.'/, (str) => str.slice(1, -1));

// RegEx: Matches all numbers with the digits 0-9, except for those with comma seperators.
defineType("number", /-?\d+(\.\d+)?/, Number.parseFloat);

// RegEx: Matches only `nice` and `not nice`.
defineType("bool", /(not)?nice/, (str) => str == "nice" ? true : false);
import { question } from "readline-sync";
import { readFileSync } from "fs";

import "../lib/instructions";
import "../lib/types";

import { State, setAdapter, ready } from "../lib/common";
import { compile } from "../lib/compiler";

setAdapter({
	input: () => question("Input: "),
	print: str => console.log(str)
});

ready();

let programStr = readFileSync(process.argv[2]).toString().split("\n");
let program = compile(programStr);

program.executeChildren(new State()).then(() => process.exit);
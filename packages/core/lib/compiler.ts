import {
	ProgramTree,
	ProgramTreeNode,
	Adapter,
	State,
	adapter
} from "./common";
import { types, instructions } from "./manager";

interface CompilerStackElement {
	indentLevel: number;
	tree: ProgramTree;
}

export function compile(lines: string[]) {
	let program = new ProgramTree();
	let stack: CompilerStackElement[] = [{
		indentLevel: 0,
		tree: program
	}];
	let lastIndentLevel = 0;
	let lastNode: ProgramTreeNode;

	lines.forEach((line) => {
		let args = [];
		let indentLevel = 0;
		while (true) {
			if (whitespaceChars.includes(line[0])) {
				indentLevel++;
				line = line.slice(1);
			} else {
				break;
			}
		}
		if (line.length == 0) {
			return;
		}

		line = line.split("#", 1)[0].trimRight();

		let instruction = instructions.find((instruction) => {
			let parsingLine = line;
			let parsingArgs = [];
			let inValue = false;

			for (let part of instruction.parts) {
				if (inValue) {
					inValue = false;
					let value: any;
					if (part == "value") {
						// This could be any type, test all until one matches.
						let length: number;
						let foundType: boolean;
						let type;
						for (let name in types) {
							type = types[name];
							let result = type.regex.exec(parsingLine);
							type.regex.lastIndex = 0;
							if (result != null) {
								length = result[0].length;
								foundType = true;
								break;
							}
						}
						if (foundType) {
							let value: any = type.fromString(parsingLine.substr(0, length))
							parsingArgs.push(value);
						} else {
							return false;
						}
					} else {
						parsingArgs.push(types[part].fromString());
					}
				} else {
					inValue = true;
					if (parsingLine.startsWith(part)) {
						parsingLine = parsingLine.slice(part.length);
					} else {
						return false;
					}
				}
			}
			args = parsingArgs;
			return true;
		});

		let node = new ProgramTreeNode(instruction, args);
		let stackIndex = stack.findIndex(element => element.indentLevel == indentLevel);

		if (indentLevel == lastIndentLevel) {
			// This line has the same indentation as the last.
			stack[stack.length - 1].tree.children.push(node);
		} else if (stackIndex != -1) {
			// This line is less indented than the last.
			stack = stack.slice(0, stackIndex);
			stack[stackIndex - 1].tree.children.push(node);
		} else if (indentLevel > stack[stack.length - 1].indentLevel) {
			// This line is more indented than the last.
			stack.push({
				indentLevel: lastIndentLevel,
				tree: lastNode
			});
			lastNode.children.push(node);
		}
		lastIndentLevel = indentLevel;
		lastNode = node;
	});
	return program;
}

const whitespaceChars = [" ", "\t"];
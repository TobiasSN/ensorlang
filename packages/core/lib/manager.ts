import {
	BaseInstruction,
	NormalInstruction,
	BlockInstruction,
	NormalInstructionHandler,
	BlockInstructionHandler
} from "./common";

// Instruction management.

/**
 * Contains all the instructions that have been registered.
 */
export let instructions: BaseInstruction[] = [];

/**
 * Defines an instruction. Format is as follows:
 * 
 * It can be any valid string. Any text inside greater/less than symbols (`<` and `>`) is assumed to be
 * the name of a type, unless it's `value`, in which case the type can be anything. It represents a
 * parameter which the instruction accepts.
 * 
 * @param definition - The syntax for this instruction.
 * @param handler - The function that handles this instruction.
 * @param expectedType - The type that's expected to be in the current register, or null.
 */
export function instruction(definition: string, handler: NormalInstructionHandler, expectedType: string) {
	instructions.push({
		parts: parseInstructionDefinition(definition),
		handler,
		expectedType,
		type: "normal"
	});
}

/**
 * Defines a block instruction. Format is as follows:
 * 
 * It can be any valid string. Any text inside greater/less than symbols (`<` and `>`) is assumed to be
 * the name of a type, unless it's `value`, in which case the type can be anything. It represents a
 * parameter which the instruction accepts.
 * 
 * @param definition - The syntax for this instruction.
 * @param handler - The function that handles this instruction.
 * @param expectedType - The type that's expected to be in the current register, or null.
 */
export function blockInstruction(definition: string, handler: BlockInstructionHandler, expectedType: string) {
	instructions.push({
		parts: parseInstructionDefinition(definition),
		handler,
		expectedType,
		type: "block"
	});
}

function parseInstructionDefinition(definition): string[] {
	let parts: string[] = [];
	let inValue = false;
	while (definition.length > 0) {
		if (inValue) {
			let nextPos = definition.search(">");
			if (nextPos == -1) {
				throw new InstructionDefinitionError(definition, "Found '<', but no corresponding '>'.");
			} else {
				parts.push(definition.slice(0, nextPos));
				if (nextPos == definition.length - 1) {
					break;
				} else {
					definition = definition.slice(nextPos + 1);
					inValue = false;
				}
			}
		} else {
			let nextPos = definition.search("<");
			if (nextPos == -1) {
				parts.push(definition);
				break;
			} else {
				parts.push(definition.slice(0, nextPos));
				definition = definition.slice(nextPos + 1);
				inValue = true;
			}
		}
	}
	return parts;
}

class InstructionDefinitionError extends Error {
	constructor(definition: string, message: string) {
		super();
		this.message = `${message}: ${definition}`;
	}
}

// Type management

/**
 * Represents a data type inside Ensorlang.
 * 
 * @member regex - Regular expression that matches values of this type.
 * @method fromString - Function that converts this type from its literal into a JavaScript value.
 */
export interface Type {
	regex: RegExp;
	fromString(str: string): any;
}

export function defineType(name: string, regex: RegExp, fromString: { (str: string): any }): void {
	types[name] = {
		regex: RegExp(regex, "yg"),
		fromString
	};
}

export let types = new Map<string, Type>();
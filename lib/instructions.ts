import { instruction, blockInstruction } from "./manager";
import { onReady, adapter } from "./common";

let input, print;

instruction("I said it should be <value>", (state, [value]) => {
	state.current = value;
}, null);

instruction("Nice", (state) => {
	state.pointer += 1;
}, null);

instruction("Oh not nice", (state) => {
	state.pointer -= 1;
}, null);

instruction("Rip", (state) => {
	state.running = false;
}, null);

instruction("I have to cancle", (state) => {
	state.current = 0;
}, null);

instruction("Yeah if you saw it not long ago then they should have it", (state) => {
	print(state.current);
}, null);

instruction("That's up to you", async (state) => {
	state.current = await input();
}, null);

instruction("Thsats good", (state) => {
	let current = state.current;
	let next = state.memory[state.pointer + 1];

	let currentType = typeof (current);
	let nextType = typeof (next);

	if (currentType == "boolean" || nextType == "boolean") {
		print("Can't add booleans to other values.");
		state.running == false;
	} else if (currentType == "string" || nextType == "string" || currentType == "number" && nextType == "number") {
		state.current = current + next;
	}
}, null);

blockInstruction("Oh yeah that should work if it's <value>", (inner, state, [value]) => {
	if (state.current == value) {
		return inner();
	}
}, null);

blockInstruction("Oh yeah that should work if it's not <value>", (inner, state, [value]) => {
	if (state.current != value) {
		return inner();
	}
}, null);

blockInstruction("Oh yeah that should work unless something comes up if it’s <value>", async (inner, state, [value]) => {
	while (state.current == value) {
		let returnVal = inner();
		if (returnVal instanceof Promise) {
			await returnVal;
		}
	}
}, null);

blockInstruction("Oh yeah that should work unless something comes up if it’s not <value>", async (inner, state, [value]) => {
	while (state.current != value) {
		let returnVal = inner();
		if (returnVal instanceof Promise) {
			await returnVal;
		}
	}
}, null);

onReady(() => {
	// Can't use destructuring here for some reason.
	input = adapter.input;
	print = adapter.print;
});
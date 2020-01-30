// Instructions

/**
 * Function that defines the behavior of an instruction.
 * 
 * @param state - The current state of the program.
 * @param args - Any arguments passed to the instruction.
 */
export interface NormalInstructionHandler {
	(state?: State, args?: any[]): Promise<void> | void;
}

/**
 * Function that defines the behavior of a block instruction.
 * 
 * @param inner - Executes the code inside this block.
 * @param state - The current state of the program.
 * @param args - Any arguments passed to the instruction.
 */
export interface BlockInstructionHandler {
	(inner: { (): void | Promise<void> }, state?: State, args?: any[]): Promise<void> | void;
}

export interface BaseInstruction {
	expectedType: string | null;
	parts: string[]
	type: string;
	handler: any;
}

export interface NormalInstruction extends BaseInstruction {
	handler: NormalInstructionHandler;
}

export interface BlockInstruction extends BaseInstruction {
	handler: BlockInstructionHandler;
}

// Handling of when things are ready.

let readyHandlers: Function[] = [];

/**
 * Adds a function to be called when the runtine is ready.
 * 
 * @param handler - The function to be called.
 */
export function onReady(handler: Function) {
	readyHandlers.push(handler);
}

/**
 * Should be called when ready.
 */
export function ready() {
	readyHandlers.forEach(handler => handler());
}

// Programs

export class ProgramTree {
	children: ProgramTreeNode[] = [];

	async executeChildren(state: State) {
		for (let child of this.children) {
			await child.execute(state);
			if (!state.running) {
				return;
			}
		}
	}
}

export class ProgramTreeNode extends ProgramTree {
	instruction: BaseInstruction;
	args: any[];

	constructor(instruction: BaseInstruction, args: any[]) {
		super();
		this.instruction = instruction;
		this.args = args;
	}

	async execute(state: State) {
		if (this.instruction.type == "normal") {
			await (this.instruction as NormalInstruction).handler(state, this.args);
		} else {
			await (this.instruction as BlockInstruction).handler(this.executeChildren.bind(this, state), state, this.args);
		}
	}
}

// IO

export let adapter: Adapter;

/**
 * Represents an object that provides IO for a certain environment.
 */
export interface Adapter {
	input(): Promise<string>;
	print(value: any): void;
}

/**
 * Sets the adapter to be used in the current environment.
 * 
 * @param adapterArg The adapter to be used.
 */
export function setAdapter(adapterArg: Adapter) {
	adapter = adapterArg;
}

// Other

/**
 * Represents the current state of the program.
 * 
 * @member pointer - Current index in memory.
 * @member memory - Array of all the values in memory.
 * @member running - Should be set to false to exit the program.
 */
export class State {
	pointer: number = 0;
	memory: any[] = [];
	running: boolean = true;

	get current() {
		return this.memory[this.pointer];
	}

	set current(value) {
		this.memory[this.pointer] = value;
	}
}
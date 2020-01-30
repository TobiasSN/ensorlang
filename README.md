Esoteric language based on the messages received by someone I know from one of his former friends. If you're in the Bit Phoenix Discord server, you'll know who.

# Running

Clone this repository, then run:
```bash
npm install
```
To execute a program, run:
```bash
npm run start -- <path to program>
```

# The language itself

The original spec is [here](https://docs.google.com/document/d/1H5gahL6ewn3uhVYLyNtz4FrBfW-hIC-oarWt_fe-TA4/edit?usp=sharing). However, I'll try to explain the language in a way that fits better with how I've implemented it, while also taking some liberties, because the spec isn't very specific on certain things.

## Variables

There aren't any. Instead, you get a bunch of consecutive memory cells. You can only access one at a time. If you wanna use a different one, you gotta move the pointer. Say the memory currently looks like this:
```
> 42
  nice
  'e'
  "Hello, world"
```

The `>` points to the current memory cell. If we increase the pointer by one, it will now look like this:
```
  42
> nice
  'e'
  "Hello, world"
```

Beforehand, if we tried to access memory, we would get `42`. Now, we'll instead get `nice`. If we set it to something different, and decrease the pointer,
we'll get 42 again, because only the second memory cell was changed.

## Types

At the moment there are 4 different types:
- Numbers: Any base 10 number. Positive or negative. Decimal or integer. Examples: `-42`, `3.4`, `624`.
- Characters: Any single character. Can be a number, letter, or any other symbol. Examples: `f`, `6`, `§`.
- Strings: Any sequence of characters. Examples: `Hello, world!`, `Lorem ipsum dolot sit amet.`, `¡““§∞§™£`.
- Booleans: Either `nice` or `not nice`. Basically yes or no, true or false, black or white, etc. `nice` corresponds to `true` in most other languages, while `not nice` corresponds to `false`.

## Program structure

This is simple. Each line can contain a single instruction and/or a comment, but it can also be empty.

There are also blocks. You create a block by indenting a line that contains an instruction more than the last. It will belong to the last line. Then, to end the block, you remove whitespace to match the indentation of the block that you want to go back to. All lines that don't have any indentation belong to the base block.

Indentation can be either spaces or tabs. A single tab is considered the same as a single space, so to avoid confusion, you should avoid mixing the two.

## Instructions

These are the individual pieces that make up programs. Think of them as the Lego pieces that make up a Lego house. If there aren't any pieces, there's not any house.

Instructions come in two variants:

### Normal instructions

These are the ones that do things. Stuff like "set the value of this cell" or "print this". They're basically the æbleskiver of your program.

- `I said it should be <value>` - Sets the value of the current memory cell to the one provided.
- `Nice` - Increases the pointer by one.
- `Oh not nice` - Decreases the pointer by one.
- `Rip` - Stops the program.
- `I have to cancle` - Sets the value of the current memory cell to `0`.
- `Yeah if you saw it not long ago then they should have it` - Prints the value of the current memory cell.
- `That's up to you` - Accepts input from the user and stores it in the current register as a string.

### Block instructions

But you can't just eat æbleskiver, can you? No, you also need some powdered suger and jam to dip them in. Otherwise they wouldn't taste as good. And I'd punch you in the face for disrespecting Danish culture. Similarly, without block instructions, your program won't be able to do all that much. They basically change how the program is executed. See [Program Structure](#program-structure) for more details.

- `Oh yeah that should work if it’s <value>` - If the value is equal to that in the current memory cell, execute the block belonging to this line.
- `Oh yeah that should work if it’s not <value>` - Same as above, but only if it's not equal.
- `Oh yeah that should work unless something comes up if it’s <value>` - Will execute the block as long as the value is equal to the one in the memory cell that's current at the time of when the line is executed.
- `Oh yeah that should work unless something comes up if it’s not <value>` - Same as before, but only if it's not equal.

# Contributing

TODO: Write this part someday. <!-- Probably not gonna happen lol. -->
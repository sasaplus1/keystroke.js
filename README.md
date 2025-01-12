# keystroke.js

[![JSR](https://jsr.io/badges/@sasaplus1/keystroke)](https://jsr.io/@sasaplus1/keystroke)
[![NPM Version](https://img.shields.io/npm/v/%40sasaplus1%2Fkeystroke)](https://www.npmjs.com/package/@sasaplus1/keystroke)

manage keystroke

## Installation

```sh
$ deno add jsr:@sasaplus1/keystroke
```

```sh
$ npm install @sasaplus1/keystroke
```

## Usage

```ts
import {
  type Keystroke,
  KeystrokeTree,
  parse,
  stringify,
} from "@sasaplus1/keystroke";

parse("cit"); // => [{code: "c", ... }, {code: "i", ... }, {code: "t", ... }]
parse("<C-x><C-c>"); // => [{code: "x", ctrl: true, ... }, {code: "c", ctrl: true, ... }]

stringify({ code: "i" } as Keystroke); // => "i"
stringify({ code: "f", ctrl: true } as Keystroke); // => "<C-f>"

const kt = new KeystrokeTree<() => string>();

kt.set("<C-x><C-c>", () => "exit");
kt.get("<C-x><C-c>")?.(); // => "exit"

kt.set("<C-x>6k", () => "close-session");
kt.get("<C-x>6k")?.(); // => "close-session"

kt.clear();
kt.get("<C-x>6k"); // => undefined
```

## License

The MIT license

# keystroke.js

[![JSR](https://jsr.io/badges/@sasaplus1/keystroke)](https://jsr.io/@sasaplus1/keystroke)

manage keystroke

## Installation

```sh
$ deno add jsr:@sasaplus1/keystroke
```

## Usage

```ts
import { parse } from "@sasaplus1/keystroke";

parse("cit"); // => [{code: "c", ... }, {code: "i", ... }, {code: "t", ... }]
parse("<C-x><C-c>"); // => [{code: "x", ctrl: true, ... }, {code: "c", ctrl: true, ... }]
```

## License

The MIT license

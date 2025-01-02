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

parse("cit"); // => [{code: 'C', ... }, {code: 'I', ... }, {code: 'T', ... }]
parse("<C-x><C-c>"); // => [{code: 'X', ctrl: true, ... }, {code: 'C', ctrl: true, ... }]
```

## License

The MIT license

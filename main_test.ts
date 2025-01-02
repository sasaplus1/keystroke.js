import { assertEquals } from "@std/assert";
import { type Keystroke, parse } from "./main.ts";

const baseExpected: Keystroke = {
  alt: false,
  code: "",
  ctrl: false,
  meta: false,
  raw: "",
  shift: false,
};

const testcases: {
  input: string;
  expected: Keystroke[];
}[] = [];

testcases.push({
  input: "i",
  expected: [{ ...baseExpected, code: "i", raw: "i" }],
});
testcases.push({
  input: "gg",
  expected: [
    { ...baseExpected, code: "g", raw: "g" },
    { ...baseExpected, code: "g", raw: "g" },
  ],
});
testcases.push({
  input: "cit",
  expected: [
    { ...baseExpected, code: "c", raw: "c" },
    { ...baseExpected, code: "i", raw: "i" },
    { ...baseExpected, code: "t", raw: "t" },
  ],
});

testcases.push({
  input: "<A-x>",
  expected: [{ ...baseExpected, alt: true, code: "x", raw: "<A-x>" }],
});
testcases.push({
  input: "<a-x>",
  expected: [{ ...baseExpected, alt: true, code: "x", raw: "<a-x>" }],
});
testcases.push({
  input: "<C-x>",
  expected: [{ ...baseExpected, code: "x", ctrl: true, raw: "<C-x>" }],
});
testcases.push({
  input: "<c-x>",
  expected: [{ ...baseExpected, code: "x", ctrl: true, raw: "<c-x>" }],
});
testcases.push({
  input: "<M-x>",
  expected: [{ ...baseExpected, code: "x", meta: true, raw: "<M-x>" }],
});
testcases.push({
  input: "<m-x>",
  expected: [{ ...baseExpected, code: "x", meta: true, raw: "<m-x>" }],
});
testcases.push({
  input: "<S-x>",
  expected: [{ ...baseExpected, code: "x", shift: true, raw: "<S-x>" }],
});
testcases.push({
  input: "<s-x>",
  expected: [{ ...baseExpected, code: "x", shift: true, raw: "<s-x>" }],
});

testcases.push({
  input: "<C-x><C-c>",
  expected: [
    { ...baseExpected, code: "x", ctrl: true, raw: "<C-x>" },
    { ...baseExpected, code: "c", ctrl: true, raw: "<C-c>" },
  ],
});
testcases.push({
  input: "<C-S-x><C-S-c>",
  expected: [
    { ...baseExpected, code: "x", ctrl: true, shift: true, raw: "<C-S-x>" },
    { ...baseExpected, code: "c", ctrl: true, shift: true, raw: "<C-S-c>" },
  ],
});
testcases.push({
  input: "<S-C-x><S-C-c>",
  expected: [
    { ...baseExpected, code: "x", ctrl: true, shift: true, raw: "<S-C-x>" },
    { ...baseExpected, code: "c", ctrl: true, shift: true, raw: "<S-C-c>" },
  ],
});

testcases.push({
  input: "2<C-g>",
  expected: [
    { ...baseExpected, code: "2", raw: "2" },
    { ...baseExpected, code: "g", ctrl: true, raw: "<C-g>" },
  ],
});

testcases.push({
  input: "<ESC>",
  expected: [{ ...baseExpected, code: "ESC", raw: "<ESC>" }],
});
testcases.push({
  input: "<esc>",
  expected: [{ ...baseExpected, code: "esc", raw: "<esc>" }],
});

testcases.push({
  input: "<S-Tab>",
  expected: [{ ...baseExpected, code: "Tab", shift: true, raw: "<S-Tab>" }],
});
testcases.push({
  input: "<C-CR>",
  expected: [{ ...baseExpected, code: "CR", ctrl: true, raw: "<C-CR>" }],
});

testcases.push({
  input: "",
  expected: [],
});
testcases.push({
  input: "<>",
  expected: [{ ...baseExpected, code: "", raw: "<>" }],
});
testcases.push({
  input: "<C->",
  expected: [{ ...baseExpected, code: "", ctrl: true, raw: "<C->" }],
});

for (const { input, expected } of testcases) {
  Deno.test(`parse("${input}")`, () => {
    assertEquals(parse(input), expected);
  });
}

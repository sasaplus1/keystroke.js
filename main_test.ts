import { assertEquals } from "@std/assert";
import { type KeyStroke, parse } from "./main.ts";

const baseExpected: KeyStroke = {
  alt: false,
  code: "",
  ctrl: false,
  invalid: "",
  meta: false,
  shift: false,
};

const testcases: {
  input: string;
  expected: KeyStroke[];
}[] = [];

testcases.push({ input: "i", expected: [{ ...baseExpected, code: "I" }] });
testcases.push({
  input: "gg",
  expected: [
    { ...baseExpected, code: "G" },
    { ...baseExpected, code: "G" },
  ],
});
testcases.push({
  input: "cit",
  expected: [
    { ...baseExpected, code: "C" },
    { ...baseExpected, code: "I" },
    { ...baseExpected, code: "T" },
  ],
});

testcases.push({
  input: "<A-x>",
  expected: [{ ...baseExpected, code: "X", alt: true }],
});
testcases.push({
  input: "<a-x>",
  expected: [{ ...baseExpected, code: "X", alt: true }],
});
testcases.push({
  input: "<C-x>",
  expected: [{ ...baseExpected, code: "X", ctrl: true }],
});
testcases.push({
  input: "<c-x>",
  expected: [{ ...baseExpected, code: "X", ctrl: true }],
});
testcases.push({
  input: "<M-x>",
  expected: [{ ...baseExpected, code: "X", meta: true }],
});
testcases.push({
  input: "<m-x>",
  expected: [{ ...baseExpected, code: "X", meta: true }],
});
testcases.push({
  input: "<S-x>",
  expected: [{ ...baseExpected, code: "X", shift: true }],
});
testcases.push({
  input: "<s-x>",
  expected: [{ ...baseExpected, code: "X", shift: true }],
});

testcases.push({
  input: "<C-x><C-c>",
  expected: [
    { ...baseExpected, code: "X", ctrl: true },
    { ...baseExpected, code: "C", ctrl: true },
  ],
});
testcases.push({
  input: "<C-S-x><C-S-c>",
  expected: [
    { ...baseExpected, code: "X", ctrl: true, shift: true },
    { ...baseExpected, code: "C", ctrl: true, shift: true },
  ],
});
testcases.push({
  input: "<S-C-x><S-C-c>",
  expected: [
    { ...baseExpected, code: "X", ctrl: true, shift: true },
    { ...baseExpected, code: "C", ctrl: true, shift: true },
  ],
});

testcases.push({
  input: "2<C-g>",
  expected: [
    { ...baseExpected, code: "2" },
    { ...baseExpected, code: "G", ctrl: true },
  ],
});

testcases.push({
  input: "<ESC>",
  expected: [{ ...baseExpected, code: "ESC" }],
});
testcases.push({
  input: "<esc>",
  expected: [{ ...baseExpected, code: "ESC" }],
});

testcases.push({
  input: "<S-Tab>",
  expected: [{ ...baseExpected, code: "TAB", shift: true }],
});
testcases.push({
  input: "<C-CR>",
  expected: [{ ...baseExpected, code: "CR", ctrl: true }],
});

testcases.push({
  input: "",
  expected: [],
});
testcases.push({
  input: "<>",
  expected: [{ ...baseExpected, code: "", invalid: "<>" }],
});
testcases.push({
  input: "<C->",
  expected: [{ ...baseExpected, code: "", invalid: "<C->" }],
});

for (const { input, expected } of testcases) {
  Deno.test(`parse("${input}")`, () => {
    assertEquals(parse(input), expected);
  });
}

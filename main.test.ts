import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { type Keystroke, KeystrokeTree, parse, stringify } from "./main.ts";

describe("parse", () => {
  const base: Keystroke = {
    alt: false,
    code: "",
    ctrl: false,
    meta: false,
    raw: "",
    shift: false,
  };

  type Testcase = { input: string; expected: Keystroke[] };

  const testcases: Testcase[] = [];

  // raw keys
  testcases.push({
    input: "i",
    expected: [{ ...base, code: "i", raw: "i" }],
  });
  testcases.push({
    input: "8",
    expected: [{ ...base, code: "8", raw: "8" }],
  });
  testcases.push({
    input: "gg",
    expected: [
      { ...base, code: "g", raw: "g" },
      { ...base, code: "g", raw: "g" },
    ],
  });
  testcases.push({
    input: "cit",
    expected: [
      { ...base, code: "c", raw: "c" },
      { ...base, code: "i", raw: "i" },
      { ...base, code: "t", raw: "t" },
    ],
  });

  // with modifiers
  testcases.push({
    input: "<A-x>",
    expected: [{ ...base, alt: true, code: "x", raw: "<A-x>" }],
  });
  testcases.push({
    input: "<a-x>",
    expected: [{ ...base, alt: true, code: "x", raw: "<a-x>" }],
  });
  testcases.push({
    input: "<C-x>",
    expected: [{ ...base, code: "x", ctrl: true, raw: "<C-x>" }],
  });
  testcases.push({
    input: "<c-x>",
    expected: [{ ...base, code: "x", ctrl: true, raw: "<c-x>" }],
  });
  testcases.push({
    input: "<M-x>",
    expected: [{ ...base, code: "x", meta: true, raw: "<M-x>" }],
  });
  testcases.push({
    input: "<m-x>",
    expected: [{ ...base, code: "x", meta: true, raw: "<m-x>" }],
  });
  testcases.push({
    input: "<S-x>",
    expected: [{ ...base, code: "x", shift: true, raw: "<S-x>" }],
  });
  testcases.push({
    input: "<s-x>",
    expected: [{ ...base, code: "x", shift: true, raw: "<s-x>" }],
  });

  // multiple keys
  testcases.push({
    input: "<C-x><C-c>",
    expected: [
      { ...base, code: "x", ctrl: true, raw: "<C-x>" },
      { ...base, code: "c", ctrl: true, raw: "<C-c>" },
    ],
  });
  testcases.push({
    input: "<C-S-x><C-S-c>",
    expected: [
      { ...base, code: "x", ctrl: true, shift: true, raw: "<C-S-x>" },
      { ...base, code: "c", ctrl: true, shift: true, raw: "<C-S-c>" },
    ],
  });
  testcases.push({
    input: "<S-C-x><S-C-c>",
    expected: [
      { ...base, code: "x", ctrl: true, shift: true, raw: "<S-C-x>" },
      { ...base, code: "c", ctrl: true, shift: true, raw: "<S-C-c>" },
    ],
  });

  testcases.push({
    input: "2<C-g>",
    expected: [
      { ...base, code: "2", raw: "2" },
      { ...base, code: "g", ctrl: true, raw: "<C-g>" },
    ],
  });
  testcases.push({
    input: "<C-x>6k",
    expected: [
      { ...base, code: "x", ctrl: true, raw: "<C-x>" },
      { ...base, code: "6", raw: "6" },
      { ...base, code: "k", raw: "k" },
    ],
  });

  // special keys
  testcases.push({
    input: "<ESC>",
    expected: [{ ...base, code: "esc", raw: "<ESC>" }],
  });
  testcases.push({
    input: "<esc>",
    expected: [{ ...base, code: "esc", raw: "<esc>" }],
  });

  testcases.push({
    input: "<S-Tab>",
    expected: [{ ...base, code: "tab", shift: true, raw: "<S-Tab>" }],
  });
  testcases.push({
    input: "<C-CR>",
    expected: [{ ...base, code: "cr", ctrl: true, raw: "<C-CR>" }],
  });

  // invalid keys
  testcases.push({
    input: "",
    expected: [],
  });
  testcases.push({
    input: "<>",
    expected: [{ ...base, code: "", raw: "<>" }],
  });
  testcases.push({
    input: "<C->",
    expected: [{ ...base, code: "", ctrl: true, raw: "<C->" }],
  });

  // NOTE: vitest has it.each, but portability is a priority
  for (const { input, expected } of testcases) {
    it(`can parse "${input}"`, () => {
      expect(parse(input)).toEqual(expected);
    });
  }
});

describe("stringify", () => {
  const base: Keystroke = {
    alt: false,
    code: "",
    ctrl: false,
    meta: false,
    raw: "",
    shift: false,
  };

  type Testcase = { input: Keystroke; expected: string };

  const testcases: Testcase[] = [];

  // raw key
  testcases.push({ input: { ...base, code: "i" }, expected: "i" });
  testcases.push({ input: { ...base, code: "8" }, expected: "8" });
  testcases.push({ input: { ...base, code: "/" }, expected: "/" });

  // with modifiers
  testcases.push({
    input: { ...base, code: "x", alt: true },
    expected: "<A-x>",
  });
  testcases.push({
    input: { ...base, code: "f", ctrl: true },
    expected: "<C-f>",
  });
  testcases.push({
    input: { ...base, code: "x", meta: true },
    expected: "<M-x>",
  });
  testcases.push({
    input: { ...base, code: "g", shift: true },
    expected: "<S-g>",
  });
  testcases.push({ input: { ...base, code: "G" }, expected: "<S-g>" });

  // multiple modifiers
  testcases.push({
    input: { ...base, code: "k", ctrl: true, shift: true },
    expected: "<C-S-k>",
  });
  testcases.push({
    input: { ...base, code: "u", alt: true, meta: true },
    expected: "<A-M-u>",
  });

  // special keys
  testcases.push({ input: { ...base, code: "esc" }, expected: "<esc>" });
  testcases.push({
    input: { ...base, code: "tab", shift: true },
    expected: "<S-tab>",
  });
  testcases.push({
    input: { ...base, code: "cr", ctrl: true },
    expected: "<C-cr>",
  });

  // invalid keys
  testcases.push({ input: { ...base, code: "" }, expected: "" });
  testcases.push({
    input: { ...base, code: "", ctrl: true },
    expected: "<C->",
  });

  for (const { input, expected } of testcases) {
    it(`can stringify to "${expected}"`, () => {
      expect(stringify(input)).toEqual(expected);
    });
  }
});

describe("KeystrokeTree", () => {
  describe("clear", () => {
    it("can clear the tree", () => {
      const kt = new KeystrokeTree<string>();

      kt.set("i", "insert");
      kt.clear();

      expect(kt.get("i")).toBe(null);
    });
  });
  describe("get & set", () => {
    it("can set and get a value by keystroke", () => {
      const kt = new KeystrokeTree<() => string>();

      expect(kt.get("i")).toBe(null);

      kt.set("i", () => "i");
      expect(kt.get("i")?.()).toBe("i");

      kt.set("<C-x><C-c>", () => "<C-x><C-c>");
      expect(kt.get("<C-x><C-c>")?.()).toBe("<C-x><C-c>");

      kt.set("<C-x>", () => "<C-x>");
      expect(kt.get("<C-x>")?.()).toBe("<C-x>");

      kt.set("<C-x><C-c>", () => "exit");
      expect(kt.get("<C-x><C-c>")?.()).toBe("exit");
    });
  });
});

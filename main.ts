/**
 * KeyStroke structure
 */
export type KeyStroke = {
  /** with alt key */
  alt: boolean;
  /** code string */
  code: string;
  /** with ctrl key */
  ctrl: boolean;
  /** with meta key */
  meta: boolean;
  /** raw keystroke string */
  raw: string;
  /** with shift key */
  shift: boolean;
};

/**
 * Parse a keystroke string into an array of KeyStroke objects
 *
 * ```ts
 * parse("i"); // => [{ alt: false, code: "i", ctrl: false, meta: false, raw: "i", shift: false }]
 * parse("<C-x>"); // => [{ alt: false, code: "x", ctrl: true, meta: false, raw: "<C-x>", shift: false }]
 * ```
 */
export function parse(keystroke: string): KeyStroke[] {
  const keys = keystroke.match(/<([^>]*)>|(.)/g);

  if (!keys) {
    return [];
  }

  const result = keys.map<KeyStroke>((key) => {
    // get code from key, e.g. <C-x> => x
    const code = /^<[^>]*>$/.test(key)
      ? key.replace(/(?:[<>]|[acms]-)/gi, "")
      : key;

    return {
      alt: /a-/i.test(key),
      code,
      ctrl: /c-/i.test(key),
      meta: /m-/i.test(key),
      raw: key,
      shift: /s-/i.test(key),
    };
  });

  return result;
}

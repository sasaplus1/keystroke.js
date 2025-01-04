/** Keystroke structure */
export type Keystroke = {
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
 * parse a keystroke string
 * @param keystroke - keystroke string
 * @returns Keystroke objects
 * @example
 * ```ts
 * parse("cit"); // => [{ code: "c", ... },{ code: "i", ... },{ code: "t", ... }]
 * parse("<C-x><C-c>"); // => [{ code: "x", ctrl: true, ... },{ code: "c", ctrl: true, ... }]
 * ```
 */
export function parse(keystroke: string): Keystroke[] {
  const keys = keystroke.match(/<([^>]*)>|(.)/g);

  if (!keys) {
    return [];
  }

  const result = keys.map<Keystroke>((key) => {
    // get code from key, e.g. <C-x> => x
    const code = /^<[^>]*>$/.test(key)
      ? key.replace(/(?:[<>]|[acms]-)/gi, "")
      : key;

    return {
      alt: /a-/i.test(key),
      code: code.toLowerCase(),
      ctrl: /c-/i.test(key),
      meta: /m-/i.test(key),
      raw: key,
      shift: /s-/i.test(key) || /^[A-Z]$/.test(code),
    };
  });

  return result;
}

/**
 * stringify a Keystroke object
 * @param keystroke - Keystroke object
 * @returns keystroke string
 * @example
 * ```ts
 * stringify({ code: "i" } as Keystroke); // => "i"
 * stringify({ code: "x", ctrl: true } as Keystroke); // => "<C-x>"
 * ```
 */
export function stringify(keystroke: Keystroke): string {
  const { alt, code, ctrl, meta, shift } = keystroke;
  const result: string[] = [];

  if (alt) {
    result.push("A-");
  }
  if (ctrl) {
    result.push("C-");
  }
  if (meta) {
    result.push("M-");
  }
  if (shift || /^[A-Z]$/.test(code)) {
    result.push("S-");
  }

  result.push(code.toLowerCase());

  const key = result.join("");

  return key.length > 1 ? `<${key}>` : key;
}

/** Keystroke node */
export type KeystrokeNode<T> = {
  children: {
    [key: string]: KeystrokeNode<T>;
  };
  value?: T;
};

/** root of Keystroke tree */
export type KeystrokeRoot<T> = Pick<KeystrokeNode<T>, "children">;

/**
 * Keystroke tree class
 * @example
 * ```ts
 * const ks = new KeystrokeTree<() => void>();
 * ks.set("i", () => "i");
 * ks.set("<C-x><C-c>", () => "<C-x><C-c>");
 * ks.get("i")?.(); // => "i"
 * ks.get("<C-x><C-c>")?.(); // => "<C-x><C-c>"
 * ```
 */
export class KeystrokeTree<T> {
  /**
   * root of Keystroke tree
   * @private
   */
  _keystrokeRoot: KeystrokeRoot<T>;

  constructor() {
    this._keystrokeRoot = {
      children: {},
    };
  }

  /** clear keystroke nodes */
  clear(): void {
    this._keystrokeRoot = {
      children: {},
    };
  }

  /**
   * get value of a keystroke
   * @param keystroke - keystroke string
   * @returns return value of the keystroke if exists, otherwise undefined
   */
  get(keystroke: string): T | undefined {
    const keystrokes = parse(keystroke);

    let node: KeystrokeRoot<T> | KeystrokeNode<T> = this._keystrokeRoot;

    for (const ks of keystrokes) {
      const key = stringify(ks);

      if (!node.children[key]) {
        return undefined;
      }

      node = node.children[key] as KeystrokeNode<T>;
    }

    return (node as KeystrokeNode<T>).value;
  }

  /**
   * set value of a keystroke
   * @param keystroke - keystroke string
   * @param value - value of keystroke
   */
  set(keystroke: string, value: T): void {
    const keystrokes = parse(keystroke);

    let node: KeystrokeRoot<T> | KeystrokeNode<T> = this._keystrokeRoot;

    for (const ks of keystrokes) {
      const key = stringify(ks);

      if (!node.children[key]) {
        node.children[key] = { children: {} };
      }

      node = node.children[key] as KeystrokeNode<T>;
    }

    (node as KeystrokeNode<T>).value = value;
  }
}

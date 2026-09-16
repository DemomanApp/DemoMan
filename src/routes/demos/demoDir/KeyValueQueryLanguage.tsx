import type { QueryLanguage } from "./QueryLanguage";

import classes from "./KeyValueQueryLanguage.module.css";

export type Token = { raw: string } & (
  | { type: "text"; value: string }
  | { type: "filter"; value: { key: string; value: string } }
  | { type: "invalid-filter"; value: { key: string; value: string } }
);

export type Parameters = {
  filterPatterns: Record<string, string[]>;
};

export const keyValueQueryLanguage: QueryLanguage<Token, Parameters> = {
  tokenizer: (query: string) => {
    const tokens: string[] = [];
    let start = 0;
    let quoted = false;
    let escaped = false;

    for (let index = 0; index < query.length; index++) {
      const symbol = query[index];
      if (escaped) {
        escaped = false;
      } else if (symbol === "\\") {
        escaped = true;
      } else if (symbol === '"') {
        quoted = !quoted;
      } else if (symbol === " " && !quoted) {
        tokens.push(query.slice(start, index));
        start = index + 1;
      }
    }

    tokens.push(query.slice(start));
    return tokens;
  },
  parser: (token: string, { filterPatterns }): Token => {
    const matches = /^(!?[a-zA-Z0-9-_]+):(.*)$/.exec(token);
    if (matches !== null) {
      const [_, key, rawValue] = matches;
      const value = decodeQueryValue(rawValue);

      if (Object.keys(filterPatterns).includes(key.replace(/^!/, ""))) {
        return { type: "filter", raw: token, value: { key, value } };
      } else {
        return { type: "invalid-filter", raw: token, value: { key, value } };
      }
    }
    return { type: "text", raw: token, value: decodeQueryValue(token) };
  },
  renderTokens: (tokens: Token[]) =>
    tokens
      .map((token, index) => {
        switch (token.type) {
          case "filter":
            return (
              <span
                className={classes.filter}
                key={`${index} ${token.value.key} ${token.value.value}`}
              >
                <span className={classes.filterKey}>{token.value.key}</span>:
                <span className={classes.filterValue}>
                  {token.raw.slice(token.value.key.length + 1)}
                </span>
              </span>
            );
          case "invalid-filter":
            return (
              <span
                className={classes.invalidFilter}
                key={`${index} ${token.value.key} ${token.value.value}`}
              >
                <span className={classes.filterKey}>{token.value.key}</span>:
                <span className={classes.filterValue}>
                  {token.raw.slice(token.value.key.length + 1)}
                </span>
              </span>
            );
          default:
            return token.raw;
        }
      })
      .intersperse(" "),
};

export const decodeQueryValue = (value: string) =>
  value.replace(
    /\\([\\ "])|"/g,
    (_match, escaped: string | undefined) => escaped ?? ""
  );

export const quoteQueryValue = (value: string) =>
  /[\s"\\]/.test(value)
    ? `"${value.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`
    : value;

import type { QueryLanguage } from "./QueryLanguage";

import classes from "./KeyValueQueryLanguage.module.css";

export type Token =
  | { type: "text"; value: string }
  | { type: "filter"; value: { key: string; value: string } }
  | { type: "invalid-filter"; value: { key: string; value: string } };

export type Parameters = {
  filterKeys: Record<string, string[]>;
};

export const keyValueQueryLanguage: QueryLanguage<Token, Parameters> = {
  tokenizer: (query: string) => query.split(" "),
  parser: (token: string, { filterKeys }): Token => {
    const matches = /^([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]*)$/.exec(token);
    if (matches !== null) {
      const [_, key, value] = matches;

      if (Object.keys(filterKeys).includes(key)) {
        return { type: "filter", value: { key, value } };
      } else {
        return { type: "invalid-filter", value: { key, value } };
      }
    }
    return { type: "text", value: token };
  },
  renderTokens: (tokens: Token[]) =>
    tokens
      .map((token) => {
        switch (token.type) {
          case "filter":
            return (
              <span
                className={classes.filter}
                key={`${token.value.key} ${token.value.value}`}
              >
                <span className={classes.filterKey}>{token.value.key}</span>:
                <span className={classes.filterValue}>{token.value.value}</span>
              </span>
            );
          case "invalid-filter":
            return (
              <span
                className={classes.invalidFilter}
                key={`${token.value.key} ${token.value.value}`}
              >
                <span className={classes.filterKey}>{token.value.key}</span>:
                <span className={classes.filterValue}>{token.value.value}</span>
              </span>
            );
          default:
            return token.value;
        }
      })
      .intersperse(" "),
};

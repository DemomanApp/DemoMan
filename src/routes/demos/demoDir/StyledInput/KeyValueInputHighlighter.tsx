import { useCallback } from "react";

import StyledInput, { type InputRefProp } from ".";

import classes from "./KeyValueInputHighlighter.module.css";

export type Token =
  | { type: "text"; value: string }
  | { type: "filter"; value: { key: string; value: string } }
  | { type: "invalid-filter"; value: { key: string; value: string } };

export const tokenizer = (query: string) => query.split(" ");

export const parser = (
  token: string,
  filterKeys: Record<string, string[]>
): Token => {
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
};

export const highlighter = (token: Token) => {
  switch (token.type) {
    case "text":
      return token.value;
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
  }
};

type KeyValueInputHighlighterProps = React.ComponentProps<"input"> &
  InputRefProp & {
    filterKeys: Record<string, string[]>;
  };

export default ({ filterKeys, ...props }: KeyValueInputHighlighterProps) => {
  const parserProp = useCallback(
    (token: string) => {
      return parser(token, filterKeys);
    },
    [filterKeys]
  );

  return (
    <StyledInput
      tokenizer={tokenizer}
      parser={parserProp}
      renderToken={highlighter}
      {...props}
    />
  );
};

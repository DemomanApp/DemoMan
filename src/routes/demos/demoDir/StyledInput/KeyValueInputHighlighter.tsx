import StyledInput, { type InputRefProp } from ".";

import classes from "./KeyValueInputHighlighter.module.css";

export type Token =
  | { type: "text"; value: string }
  | { type: "filter"; value: { key: string; value: string } };

export const tokenizer = (query: string) => query.split(" ");

export const parser = (token: string): Token => {
  const matches = /^([a-zA-Z0-9-_]+):([a-zA-Z0-9-_]*)$/.exec(token);
  if (matches !== null) {
    return { type: "filter", value: { key: matches[1], value: matches[2] } };
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
          key={`${token.value.key}${token.value.value}`}
        >
          {token.value.key}:{token.value.value}
        </span>
      );
  }
};

export default (props: React.ComponentProps<"input"> & InputRefProp) => {
  return (
    <StyledInput
      tokenizer={tokenizer}
      parser={parser}
      renderToken={highlighter}
      {...props}
    />
  );
};

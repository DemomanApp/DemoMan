import { type ReactNode, useCallback, useEffect, useRef } from "react";

import { useMergedRef } from "@mantine/hooks";

import classes from "./StyledInput.module.css";

export type InputRefProp = {
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

type StyledInputProps<Token> = React.ComponentProps<"input"> &
  InputRefProp & {
    tokenizer(query: string): string[];
    parser(token: string): Token;
    renderToken(token: Token): ReactNode;
  };

export default <Token,>({
  value,
  tokenizer,
  parser,
  renderToken,
  style,
  className,
  ref,
  inputRef: inputRefProp,
  ...otherProps
}: StyledInputProps<Token>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const mergedInputRef = useMergedRef(inputRef, inputRefProp);

  const tokens = tokenizer(value as string).map(parser);

  const updateSizer = useCallback((input: string) => {
    if (sizerRef.current !== null && inputRef.current !== null) {
      sizerRef.current.innerText = input;
      inputRef.current.style.width = `max(calc(${sizerRef.current.scrollWidth}px + 0.25em), 200px)`;
    }
  }, []);

  useEffect(() => {
    updateSizer(value as string);
    if (inputRef.current !== null) {
      inputRef.current.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }, [updateSizer, value]);

  console.log({ value });

  return (
    <div
      className={className}
      onClick={() => {
        inputRef.current?.focus();
      }}
      ref={ref}
    >
      <div className={classes.wrapper}>
        <div ref={highlightRef} className={classes.styledContent}>
          {tokens.map(renderToken).intersperse(" ")}
        </div>

        <div className={classes.inputWrapper}>
          <div className={classes.sizer} ref={sizerRef} />
          <input
            ref={mergedInputRef}
            className={classes.input}
            value={value}
            {...otherProps}
          />
        </div>
      </div>
    </div>
  );
};

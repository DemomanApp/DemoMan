import { useCallback, useEffect, useRef } from "react";

import { useMergedRef } from "@mantine/hooks";

import type { QueryLanguage } from "../QueryLanguage";

import classes from "./StyledInput.module.css";

export type InputRefProp = {
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

type StyledInputProps<Token, Parameters> = React.ComponentProps<"input"> &
  InputRefProp & {
    queryLanguage: QueryLanguage<Token, Parameters>;
    queryLanguageParameters: Parameters;
  };

export default <Token, Parameters>({
  value,
  style,
  className,
  ref,
  inputRef: inputRefProp,
  queryLanguage,
  queryLanguageParameters,
  ...otherProps
}: StyledInputProps<Token, Parameters>) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const mergedInputRef = useMergedRef(inputRef, inputRefProp);

  const tokens = queryLanguage
    .tokenizer(value as string, queryLanguageParameters)
    .map((token) => queryLanguage.parser(token, queryLanguageParameters));

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
          {queryLanguage.renderTokens(tokens, queryLanguageParameters)}
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

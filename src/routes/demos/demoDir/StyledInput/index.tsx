import { useCallback, useEffect, useRef } from "react";

import { useMergedRef } from "@mantine/hooks";

import classes from "./StyledInput.module.css";

export type InputRefProp = {
  inputRef?: React.RefObject<HTMLInputElement | null>;
};

type StyledInputProps = React.ComponentProps<"input"> &
  InputRefProp & {
    value: string;
    highlight(value: string): React.ReactNode;
  };

export default ({
  value,
  style,
  className,
  ref,
  inputRef: inputRefProp,
  highlight,
  ...otherProps
}: StyledInputProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const sizerRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);

  const mergedInputRef = useMergedRef(inputRef, inputRefProp);

  const updateSizer = useCallback((input: string) => {
    if (sizerRef.current !== null && inputRef.current !== null) {
      sizerRef.current.innerText = input;
      inputRef.current.style.width = `max(calc(${sizerRef.current.scrollWidth}px + 0.25em), 200px)`;
    }
  }, []);

  useEffect(() => {
    updateSizer(value);
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
          {highlight(value)}
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

import { type ReactNode, forwardRef } from "react";

import { UnstyledButton } from "@mantine/core";

import classes from "./HeaderButton.module.css";

type HeaderButtonProps = {
  onClick?(): void;
  disabled?: boolean;
  children: ReactNode;
};

export default forwardRef<HTMLButtonElement, HeaderButtonProps>(
  function _HeaderButton(
    { onClick, disabled, children }: HeaderButtonProps,
    ref
  ) {
    return (
      <UnstyledButton
        onClick={onClick}
        className={classes.button}
        disabled={disabled}
        ref={ref}
      >
        {children}
      </UnstyledButton>
    );
  }
);

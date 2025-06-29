import { type ComponentPropsWithoutRef, forwardRef } from "react";

import { useAsyncCallback } from "react-async-hook";

import { Button, type ButtonProps } from "@mantine/core";

export type AsyncButtonProps = {
  onClick(): Promise<unknown>;
} & ButtonProps &
  ComponentPropsWithoutRef<"button">;

export default forwardRef<HTMLButtonElement, AsyncButtonProps>(
  ({ onClick, children, ...other }: AsyncButtonProps, ref) => {
    const asyncOnClick = useAsyncCallback(onClick);

    return (
      <Button
        onClick={asyncOnClick.execute}
        loading={asyncOnClick.loading}
        ref={ref}
        {...other}
      >
        {children}
      </Button>
    );
  }
);

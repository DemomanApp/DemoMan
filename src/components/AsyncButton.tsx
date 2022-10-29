import { Button, ButtonProps } from "@mantine/core";
import { ComponentPropsWithRef, forwardRef } from "react";
import { useAsyncCallback } from "react-async-hook";

export type AsyncButtonProps = {
  onClick(): Promise<unknown>;
} & ButtonProps &
  ComponentPropsWithRef<"button">;

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

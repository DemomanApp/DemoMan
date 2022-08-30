/* eslint-disable @typescript-eslint/no-explicit-any */
import { useAsync } from "react-async-hook";

export type AsyncProps<R, Args extends any[]> = {
  promiseFn: (...args: Args) => Promise<R>;
  args: Args;
  loading: JSX.Element;
  error(e: Error): JSX.Element;
  success(result: R): JSX.Element;
};

export default function Async<R = unknown, Args extends any[] = any[]>({
  promiseFn,
  args,
  loading,
  error,
  success,
}: AsyncProps<R, Args>) {
  const asyncState = useAsync(promiseFn, args);

  if (asyncState.loading) {
    return loading;
  } else if (asyncState.error !== undefined) {
    return error(asyncState.error);
  } else if (asyncState.result !== undefined) {
    return success(asyncState.result);
  } else {
    return null;
  }
}

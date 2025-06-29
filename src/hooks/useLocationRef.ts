import { useRef } from "react";

import { useNavigation } from "react-router";

/** Like useLocationState, but doesn't cause a rerender on update (like useRef, hence the name) */
export default function useLocationRef<T>(key: string, fallback: T) {
  const navigation = useNavigation();
  const lastValue = useRef(fallback);

  // When clicking a link, before the new page finished loading,
  // `history.state` already refers to the state at the new page and thus returns `fallback`.
  const value =
    navigation.state === "idle"
      ? ((history.state[key] as T) ?? fallback)
      : lastValue.current;

  function setValue(newValue: T) {
    history.replaceState({ ...history.state, [key]: newValue }, "");
    lastValue.current = newValue;
  }

  return [value, setValue] as const;
}

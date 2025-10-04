import {
  type ReactEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export const useAutocomplete = (
  queryText: string,
  setQueryText: (value: string) => void,
  filterKeys: Record<string, string[]>
) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [cursorIndex, setCursorIndex] = useState(0);
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);

  const {
    beforeCurrentToken,
    currentToken,
    currentTokenKeyValue,
    afterCursor,
  } = useMemo(() => {
    const [beforeCursor, afterCursor] = queryText.splitAt(cursorIndex);
    const lastTokenBoundary = beforeCursor.lastIndexOf(" ") + 1;
    const [beforeCurrentToken, currentToken] =
      beforeCursor.splitAt(lastTokenBoundary);

    const currentTokenColonIndex = currentToken.indexOf(":");
    const currentTokenKeyValue =
      currentTokenColonIndex === -1
        ? null
        : ([
            currentToken.slice(0, currentTokenColonIndex),
            currentToken.slice(currentTokenColonIndex + 1),
          ] as const);

    return {
      beforeCurrentToken,
      currentToken,
      currentTokenKeyValue,
      afterCursor,
    };
  }, [queryText, cursorIndex]);

  // biome-ignore lint/correctness/useExhaustiveDependencies(queryText): We want to detect changes in queryText
  useEffect(() => {
    if (
      inputRef.current !== undefined &&
      inputRef.current !== null &&
      inputRef.current.selectionEnd !== null
    ) {
      setCursorIndex(inputRef.current.selectionEnd);
    }
  }, [queryText]);

  useEffect(() => {
    if (currentTokenKeyValue === null) {
      const keys = Object.keys(filterKeys)
        .filter((key) => key.includes(currentToken))
        .map((key) => `${key}:`);
      setDropdownItems(keys);
    } else {
      const [currentTokenKey, currentTokenValue] = currentTokenKeyValue;

      const values = filterKeys[currentTokenKey];

      if (values !== undefined) {
        setDropdownItems(
          values.filter((value) => value.includes(currentTokenValue))
        );
      } else {
        setDropdownItems([]);
      }
    }
  }, [currentToken, currentTokenKeyValue, filterKeys]);

  const onOptionSubmit = useCallback(
    (optionValue: string) => {
      const escapedValue = optionValue
        .replaceAll("\\", "\\\\")
        .replaceAll(" ", "\\ ");
      if (currentTokenKeyValue !== null) {
        const [currentTokenKey, _currentTokenValue] = currentTokenKeyValue;
        setQueryText(
          `${beforeCurrentToken}${currentTokenKey}:${escapedValue} ${afterCursor}`
        );
      } else {
        setQueryText(beforeCurrentToken + escapedValue + afterCursor);
      }
    },
    [setQueryText, currentTokenKeyValue, afterCursor, beforeCurrentToken]
  );

  const onSelect: ReactEventHandler<HTMLInputElement> = useCallback((event) => {
    const selectionStart = event.currentTarget.selectionStart;

    console.log("select", selectionStart);

    if (selectionStart !== null) {
      setCursorIndex(selectionStart);
    }
  }, []);

  return [dropdownItems, onOptionSubmit, onSelect, inputRef] as const;
};

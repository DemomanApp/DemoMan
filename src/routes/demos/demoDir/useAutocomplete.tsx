import {
  type ReactEventHandler,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  filterKeys,
  parseToken,
  quoteQueryValue,
  tokenizeQuery,
} from "./KeyValueQueryLanguage";

export const useAutocomplete = (
  queryText: string,
  setQueryText: (value: string) => void,
  filterPatterns: Record<string, string[]>
) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const completionCursor = useRef<number | null>(null);

  const [cursorIndex, setCursorIndex] = useState(0);
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);

  const { beforeCurrentToken, currentToken, currentTokenKeyValue, afterToken } =
    useMemo(() => {
      const beforeCursor = queryText.slice(0, cursorIndex);
      const currentToken = tokenizeQuery(beforeCursor).at(-1) ?? "";
      const start = beforeCursor.length - currentToken.length;
      const fullToken = tokenizeQuery(queryText.slice(start))[0];
      const token = parseToken(currentToken);
      const currentTokenKeyValue =
        token.type === "text"
          ? null
          : ([token.value.key, token.value.value] as const);

      return {
        beforeCurrentToken: queryText.slice(0, start),
        currentToken,
        currentTokenKeyValue,
        afterToken: queryText.slice(start + fullToken.length),
      };
    }, [queryText, cursorIndex]);

  useLayoutEffect(() => {
    const input = inputRef.current;
    if (completionCursor.current !== null) {
      input?.setSelectionRange(
        completionCursor.current,
        completionCursor.current
      );
      completionCursor.current = null;
    }
    if (input?.selectionEnd !== null && input?.selectionEnd !== undefined) {
      setCursorIndex(input.selectionEnd);
    }
  }, [queryText]);

  useEffect(() => {
    if (currentTokenKeyValue === null) {
      const keys = filterKeys
        .map((key) => (currentToken.startsWith("!") ? `!${key}` : key))
        .filter((key) => key.includes(currentToken))
        .map((key) => `${key}:`);
      setDropdownItems(keys);
    } else {
      const [currentTokenKey, currentTokenValue] = currentTokenKeyValue;

      const values = filterPatterns[currentTokenKey.replace(/^!/, "")];

      if (values !== undefined) {
        setDropdownItems(
          values.filter((value) => value.includes(currentTokenValue))
        );
      } else {
        setDropdownItems([]);
      }
    }
  }, [currentToken, currentTokenKeyValue, filterPatterns]);

  const onOptionSubmit = useCallback(
    (optionValue: string) => {
      const completion =
        currentTokenKeyValue === null
          ? optionValue
          : `${currentTokenKeyValue[0]}:${quoteQueryValue(optionValue)} `;
      const suffix =
        currentTokenKeyValue !== null && afterToken.startsWith(" ")
          ? afterToken.slice(1)
          : afterToken;
      const nextQuery = beforeCurrentToken + completion + suffix;
      const nextCursor = beforeCurrentToken.length + completion.length;

      if (nextQuery === queryText) {
        inputRef.current?.setSelectionRange(nextCursor, nextCursor);
        setCursorIndex(nextCursor);
      } else {
        completionCursor.current = nextCursor;
        setQueryText(nextQuery);
      }
    },
    [
      setQueryText,
      queryText,
      currentTokenKeyValue,
      afterToken,
      beforeCurrentToken,
    ]
  );

  const onSelect: ReactEventHandler<HTMLInputElement> = useCallback((event) => {
    const selectionStart = event.currentTarget.selectionStart;

    if (selectionStart !== null) {
      setCursorIndex(selectionStart);
    }
  }, []);

  return [dropdownItems, onOptionSubmit, onSelect, inputRef] as const;
};

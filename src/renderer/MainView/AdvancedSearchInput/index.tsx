import React, { useCallback, useEffect, useRef, useState } from "react";

import {
  Box,
  Grow,
  IconButton,
  InputBase,
  ListItem,
  Paper,
  Popper,
} from "@mui/material";
import { Search as SearchIcon, Clear as ClearIcon } from "@mui/icons-material";

import Dropdown from "./Dropdown";
import {
  AdvancedFilterKeys,
  AdvancedFilterQuery,
  AdvancedFilterFilter,
} from "./types";
import QueryItemChips from "./QueryItemChips";
import Kbd from "../../Kbd";

type AdvancedSearchProps = {
  placeholder: string;
  width: string;
  keys: AdvancedFilterKeys;
  onSubmit: (query: AdvancedFilterQuery) => void;
};

export { AdvancedFilterQuery as Query, AdvancedFilterKeys };

export default (props: AdvancedSearchProps) => {
  const { placeholder, width, keys, onSubmit } = props;

  const [queryText, setQueryText] = useState("");
  const [popoverOpenState, setPopoverOpen] = useState<boolean>(false);
  const [filterListItems, setFilterListItems] = useState<
    AdvancedFilterFilter[]
  >([]);
  const [dropdownItems, setDropdownItems] = useState<string[]>([]);

  const popoverOpen = popoverOpenState && dropdownItems.length > 0;

  // Focus index: specifies the item that should have focus.
  // focusIndex = -1: Not focused
  // focusIndex =  0: Focus the text input
  // focusIndex >  0: Focus the dropdown element with index (focusIndex - 1)
  const [focusIndex, setFocusIndex] = useState(-1);
  // The index of the focused element in the dropdown.
  // This is null if the focused element is not part of the dropdown
  const dropdownFocusedIndex: number | null =
    focusIndex > 0 ? focusIndex - 1 : null;

  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const paperRef = useRef<HTMLDivElement>(null);
  const scrollBoxRef = useRef<typeof Box>(null);

  const colonIndex = queryText.indexOf(":");
  const queryKey = colonIndex === -1 ? null : queryText.slice(0, colonIndex);
  const queryValue = (
    colonIndex === -1 ? queryText : queryText.slice(colonIndex + 1)
  ).trim();

  const onFocus = (_event: React.FocusEvent<HTMLDivElement>) => {
    setFocusIndex(0);
    setPopoverOpen(true);
  };

  const onBlur = (_event: React.FocusEvent<HTMLDivElement>) => {
    setFocusIndex(-1);
    setPopoverOpen(false);
  };

  const addQueryPart = (key: string, value: string) => {
    const newFilterListItems = [...filterListItems];
    // Ensure each key is only specified once, replacing the old value if needed
    const oldFilterIndex = newFilterListItems.findIndex(
      ({ key: k }) => key === k
    );
    // Remove the old filter if it exists.
    if (oldFilterIndex !== -1) {
      newFilterListItems.splice(oldFilterIndex, 1);
    }
    // Add the new filter to the end of the List
    newFilterListItems.push({ key, value });

    setFilterListItems(newFilterListItems);
  };

  const removeQueryPart = (index: number) => {
    const newFilterListItems = [...filterListItems];
    newFilterListItems.splice(index, 1);
    setFilterListItems(newFilterListItems);
  };

  const determineDropdownItems = useCallback(() => {
    if (queryKey === null) {
      // Autocomplete keys
      setDropdownItems(
        Object.keys(keys)
          .filter((k: string) => k.includes(queryValue))
          .map((k: string) => `${k}:`)
      );
    } else {
      const key = keys[queryKey];
      if (key === undefined) {
        setDropdownItems([]);
      } else {
        setDropdownItems(
          key.possibleValues.filter((v: string) => v.includes(queryValue))
        );
      }
    }
  }, [keys, queryKey, queryValue]);

  const autocompleteDropdownItem = (dropdownIndex: number) => {
    const dropdownItem = dropdownItems[dropdownIndex];
    if (queryKey === null) {
      setQueryText(dropdownItem);
    } else {
      addQueryPart(queryKey, dropdownItem);
      setQueryText("");
    }
    setFocusIndex(0);
  };

  const handleAutocomplete = () => {
    // If the dropdown is not focused, autocomplete the first item
    const dropdownIndex =
      dropdownFocusedIndex === null ? 0 : dropdownFocusedIndex;
    autocompleteDropdownItem(dropdownIndex);
  };

  const getFilterFromQueryText = (): AdvancedFilterFilter | null => {
    // Try to convert the current query text into a filter.
    // Return either a Filter if successful or null if the
    // query text is not a valid filter.
    if (
      // A colon exists in the query
      queryKey !== null &&
      // Something other than spaces is behind the colon
      queryValue.length !== 0 &&
      // The key exists
      keys[queryKey] !== undefined &&
      // The value is valid
      (keys[queryKey].freeInput ||
        keys[queryKey].possibleValues.includes(queryValue))
    ) {
      return { key: queryKey, value: queryValue };
    }
    return null;
  };

  // Returns true if a filter was successfully added
  const handleAddFilter = (): boolean => {
    const newFilter = getFilterFromQueryText();
    if (newFilter === null) {
      return false;
    }
    const { key, value } = newFilter;
    addQueryPart(key, value);
    setQueryText("");
    return true;
  };

  const handleSubmit = () => {
    const filters: Record<string, string> = {};
    let text = queryText;
    filterListItems.forEach((filter) => {
      filters[filter.key] = filter.value;
    });

    // Check if the user just entered a valid tag before submitting
    const newFilter = getFilterFromQueryText();
    if (newFilter !== null) {
      const { key, value } = newFilter;
      // This just updates the visuals, we need to handle
      // adding the query to our filters manually because
      // the state updates are done asynchronously
      addQueryPart(key, value);
      setQueryText("");

      // Add the new filter to our query
      filters[key] = value;
      text = "";
    }
    onSubmit({ text, filters });
  };

  const onDropdownItemClick = (dropdownIndex: number) => {
    autocompleteDropdownItem(dropdownIndex);
    setFocusIndex(0);
  };

  const onChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    const newQuery = event.target.value;
    setQueryText(newQuery);
  };

  const onKeyDown = (
    event: React.KeyboardEvent<
      HTMLTextAreaElement | HTMLInputElement | HTMLDivElement
    >
  ) => {
    const numDropdownItems = dropdownItems.length;
    switch (event.code) {
      case "ArrowUp":
        // If the dropdown is focused: move up
        // Otherwise: do nothing
        if (focusIndex > 0) {
          setFocusIndex(focusIndex - 1);
        }
        event.preventDefault();
        break;
      case "ArrowDown":
        if (dropdownItems.length > 0 && focusIndex < numDropdownItems) {
          // Move the focus down in the dropdown if it's not already at the last position
          setFocusIndex(focusIndex + 1);
        }
        event.preventDefault();
        break;
      case "Space":
        if (handleAddFilter()) {
          // Only prevent default if the filter was successfully added
          event.preventDefault();
        }
        break;
      case "Tab":
        handleAutocomplete();
        event.preventDefault();
        break;
      case "Enter":
        handleSubmit();
        break;
      case "Backspace":
        if (
          inputRef.current?.selectionStart === 0 &&
          inputRef.current?.selectionEnd === 0
        ) {
          removeQueryPart(filterListItems.length - 1);
        }
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    determineDropdownItems();
  }, [determineDropdownItems, queryText]);

  useEffect(() => {
    if (focusIndex === 0) {
      inputRef.current?.focus();
    }
  }, [focusIndex]);

  return (
    <div onFocus={onFocus} onBlur={onBlur}>
      <Paper
        sx={(theme) => ({
          width,
          display: "flex",
          alignItems: "center",
          backgroundColor: theme.palette.background.paper,
          border: "2px solid gray",
          borderBottomLeftRadius: popoverOpen ? 0 : theme.shape.borderRadius,
          borderBottomRightRadius: popoverOpen ? 0 : theme.shape.borderRadius,
          boxSizing: "content-box",
        })}
        ref={paperRef}
        component="div"
      >
        <Box
          sx={{
            // Prevent the scrollbar from moving the layout
            overflowX: "overlay",
            width: "100%",
            display: "flex",
            // Reverse the flex direction to keep the horizontal scroll position
            // at the right when a tag is added. This is definitely a bit hacky,
            // but this works better than everything else I've tried.
            flexDirection: "row-reverse",
            alignItems: "center",
          }}
          ref={scrollBoxRef}
        >
          <InputBase
            fullWidth
            value={queryText}
            onChange={onChange}
            placeholder={placeholder}
            inputRef={inputRef}
            spellCheck={false}
            onKeyDown={onKeyDown}
            style={{
              minWidth: "10rem",
            }}
          />
          <QueryItemChips
            filterListItems={filterListItems}
            removeQueryItem={removeQueryPart}
          />
        </Box>
        {queryText.length === 0 && Object.keys(filterListItems).length === 0 ? (
          <IconButton size="large" disableRipple>
            <SearchIcon />
          </IconButton>
        ) : (
          <IconButton
            onClick={() => {
              setQueryText("");
              setFilterListItems([]);
              onSubmit({ filters: {}, text: "" });
            }}
            size="large"
            disableRipple
          >
            <ClearIcon />
          </IconButton>
        )}
      </Paper>
      <Popper
        anchorEl={paperRef.current}
        open={popoverOpen}
        transition
        style={{ userSelect: "none", zIndex: 2000 }}
      >
        {({ TransitionProps }) => (
          <Grow
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...TransitionProps}
            timeout={350}
            style={{ transformOrigin: "top center" }}
          >
            <Paper
              sx={(theme) => ({
                backgroundColor: theme.palette.background.paper,
                border: "2px solid gray",
                borderTop: "unset",
                borderTopLeftRadius: 0,
                borderTopRightRadius: 0,
                boxSizing: "content-box",
              })}
            >
              <Dropdown
                width={width}
                focusedIndex={dropdownFocusedIndex}
                items={dropdownItems}
                onItemClick={onDropdownItemClick}
              />

              <ListItem
                dense
                style={{
                  borderTop: "2px solid gray",
                  display: "flex",
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <Kbd>&#8593;</Kbd>
                  <Kbd>&#8595;</Kbd>
                  Navigate
                </div>
                <div>
                  <Kbd>tab</Kbd> Autocomplete
                </div>
                <div>
                  <Kbd>space</Kbd> Add filter
                </div>
                <div>
                  <Kbd>enter</Kbd> Submit
                </div>
              </ListItem>
            </Paper>
          </Grow>
        )}
      </Popper>
    </div>
  );
};

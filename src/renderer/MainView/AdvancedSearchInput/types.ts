// tags: key-value pairs, like {map:"process", type:"pov"}
// text: The rest of the query
export type AdvancedFilterQuery = {
  filters: Record<string, string>;
  text: string;
};

export type AdvancedFilterFilter = {
  key: string;
  value: string;
};

export type AdvancedFilterKey = {
  possibleValues: string[];
  freeInput: boolean; // Are values outside the suggestions allowed?
};

export type AdvancedFilterKeys = Record<string, AdvancedFilterKey>;

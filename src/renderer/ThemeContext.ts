import React from "react";

import { ThemeType } from "./theme";

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

export default React.createContext<ThemeContextType>({} as ThemeContextType);

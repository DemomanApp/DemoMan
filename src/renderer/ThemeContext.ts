import { createContext } from "react";

import { ThemeType } from "./theme";

type ThemeContextType = {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
};

export default createContext<ThemeContextType>({} as ThemeContextType);

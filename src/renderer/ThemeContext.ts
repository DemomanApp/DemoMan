import React from "react";

type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

export default React.createContext<ThemeContextType>({} as ThemeContextType);

import { styled } from "@mui/material/styles";

export default styled("kbd")(
  ({ theme }) => `
  padding: 4px 5px;
  display: inline-block;
  white-space: nowrap;
  margin: 0 1px;
  font: 11px SFMono-Regular,Consolas,Liberation Mono,Menlo,monospace;
  font-weight: bold;
  text-transform: uppercase;
  line-height: 10px;
  color: ${theme.palette.text.primary};
  vertical-align: middle;
  background-color: ${
    theme.palette.mode === "dark"
      ? theme.palette.grey[700]
      : theme.palette.grey[50]
  };
  border: 1px solid ${
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[300]
  };
  border-radius: 5px;
  box-shadow: inset 0 -1px 0 ${
    theme.palette.mode === "dark"
      ? theme.palette.grey[800]
      : theme.palette.grey[300]
  };
`
);

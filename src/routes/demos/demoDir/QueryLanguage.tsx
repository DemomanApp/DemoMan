import type { ReactNode } from "react";

export type QueryLanguage<Token, Parameters = undefined> = {
  tokenizer(query: string, parameters: Parameters): string[];
  parser(token: string, parameters: Parameters): Token;
  renderTokens(token: Token[], parameters: Parameters): ReactNode;
};

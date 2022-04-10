import Store, { Schema } from "electron-store";

import { ThemeType } from "../renderer/theme";

// To achieve type safety, each property in the schema
// must either be optional or have a default value set.

export type SchemaType = {
  theme: ThemeType;
  demo_path?: string;
  setup_completed: boolean;
};

const schema: Schema<SchemaType> = {
  theme: {
    enum: ["dark", "light"],
    default: "dark",
  },
  demo_path: {
    type: "string",
  },
  setup_completed: {
    type: "boolean",
    default: false,
  },
};

export default new Store<SchemaType>({
  schema,
  watch: true,
});

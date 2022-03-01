import Store from "electron-store";

type SchemaType = { theme: "dark" | "light"; demo_path: string };

const store = new Store<SchemaType>({
  schema: {
    theme: {
      enum: ["dark", "light"],
      default: "dark",
    },
    demo_path: {
      type: "string",
    },
  },
});

export default store;

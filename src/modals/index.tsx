import { RenameDemoModal } from "./RenameDemoModal";

const modals = {
  rename_demo: RenameDemoModal,
};

declare module "@mantine/modals" {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}

export default modals;

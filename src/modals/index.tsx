import { DeleteDemoModal } from "./DeleteDemoModal";
import { RenameDemoModal } from "./RenameDemoModal";

const modals = {
  rename_demo: RenameDemoModal,
  delete_demo: DeleteDemoModal,
};

declare module "@mantine/modals" {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}

export default modals;

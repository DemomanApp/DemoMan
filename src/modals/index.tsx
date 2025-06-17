import { DeleteDemoModal } from "./DeleteDemoModal";
import { DeleteMultipleDemosModal } from "./DeleteMultipleDemosModal";
import { RenameDemoModal } from "./RenameDemoModal";
import { UpdateModal } from "./UpdateModal";

const modals = {
  update: UpdateModal,
  rename_demo: RenameDemoModal,
  delete_demo: DeleteDemoModal,
  delete_multiple_demos: DeleteMultipleDemosModal,
};

declare module "@mantine/modals" {
  export interface MantineModalsOverride {
    modals: typeof modals;
  }
}

export default modals;

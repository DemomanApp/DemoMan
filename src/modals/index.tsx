import { DeleteDemoModal } from "./DeleteDemoModal";
import { DeleteMultipleDemosModal } from "./DeleteMultipleDemosModal";
import { RenameDemoModal } from "./RenameDemoModal";
import { UpdateModal } from "./UpdateModal";
import { AddDemoDirModal } from "./DemoDirModal";

const modals = {
  update: UpdateModal,
  add_demo_dir: AddDemoDirModal,
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

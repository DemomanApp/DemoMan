import { Navigate } from "react-router-dom";
import useStore from "@/hooks/useStore";

export default () => {
  const [demoDirs, _setDemoDirs] = useStore("demoDirs");

  // TEMPORARY
  // This will be replaced with something proper later
  // Ideas:
  // - Load the last used demo directory
  // - Load a user-selectable "primary" demo directory
  // - Show a selection screen, let the user choose
  const demoDirIds = Object.keys(demoDirs!);
  if (demoDirIds.length !== 0) {
    return <Navigate to={demoDirIds[0]} />;
  }
  return null;
};

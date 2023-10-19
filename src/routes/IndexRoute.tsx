import { Navigate } from "react-router-dom";

export default () => {
  // This is the first route the app loads.
  // TODO: Check the store first, then redirect to an
  //       appropriate destination (e.g. setup page if necessary)
  return <Navigate to="/demos" replace />;
};

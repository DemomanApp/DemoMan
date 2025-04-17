import { useLocation, useNavigate } from "react-router";

export default function useLocationState<T>(key: string, fallback: T) {
  const location = useLocation();
  const navigate = useNavigate();

  const state = (location.state?.[key] as T) ?? fallback;

  function setState(newState: T) {
    navigate(".", {
      state: { ...location.state, [key]: newState },
      replace: true,
    });
  }

  return [state, setState] as const;
}

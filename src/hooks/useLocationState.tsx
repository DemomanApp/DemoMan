import { useLocation, useNavigate } from "react-router-dom";

type LocationStateSetter<T> = {
  <K extends keyof T>(k: K, v: T[K]): void;
  <K extends keyof T>(k: K): (v: T[K]) => void;
};

export default function useLocationState<T>(
  defaults: T
): readonly [T, LocationStateSetter<T>] {
  const location = useLocation();
  const navigate = useNavigate();

  function setLocationState<T, K extends keyof T>(key: K, value: T[K]): void;
  function setLocationState<T, K extends keyof T>(
    key: K
  ): (value: T[K]) => void;

  function setLocationState<T, K extends keyof T>(key: K, value?: T[K]) {
    if (value === undefined) {
      return (value: T[K]) => {
        const state = { ...location.state, [key]: value };

        navigate(".", { state, replace: true });
      };
    } else {
      const state = { ...location.state, [key]: value };

      navigate(".", { state, replace: true });
    }
  }

  const state = { ...defaults, ...location.state };

  return [state, setLocationState] as const;
}

import { useNavigation } from "react-router";

export default function NavigationProgress() {
  const navigation = useNavigation();
  const isNavigating = Boolean(navigation.location);

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: isNavigating ? "100%" : "0%",
        height: isNavigating ? 4 : 0,
        backgroundColor: "var(--mantine-primary-color-filled)",
        zIndex: 99999,
        transition: isNavigating
          ? "width 5s cubic-bezier(0.1, 1, 0.3, 1), height 500ms ease"
          : "height 500ms ease, width 0ms linear 500ms",
      }}
    />
  );
}

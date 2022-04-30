import { ReactNode } from "react";

import AppBar, { AppBarProps } from "./AppBar";
import BounceTransition from "./BounceTransition";

type PageLayoutProps = { children: ReactNode } & AppBarProps;

export default function AppContentContainer(props: PageLayoutProps) {
  const { children, left, center, right } = props;
  return (
    <>
      <AppBar left={left} center={center} right={right} />
      <div
        style={{
          position: "absolute",
          height: "100vh",
          width: "100vw",
          paddingTop: "64px",
        }}
      >
        <BounceTransition otherStyles={{ height: "100%" }}>
          {children}
        </BounceTransition>
      </div>
    </>
  );
}

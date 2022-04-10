import { ReactNode } from "react";

import AppBar, { AppBarProps } from "./AppBar";
import BounceTransition from "./BounceTransition";

type PageLayoutProps = { children: ReactNode } & AppBarProps;

export default function AppContentContainer(props: PageLayoutProps) {
  const { children, left, center, right } = props;
  return (
    <>
      <AppBar left={left} center={center} right={right} />
      <div style={{ paddingTop: "64px", height: "100%" }}>
        <BounceTransition otherStyles={{ height: "100%" }}>
          {children}
        </BounceTransition>
      </div>
    </>
  );
}

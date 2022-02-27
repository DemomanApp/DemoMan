import React from "react";

import { Motion, spring, PlainStyle } from "react-motion";

type BounceTransitionProps = {
  children: React.ReactNode;
};

function bounce(val: number) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

const mapStyles = (styles: PlainStyle): React.CSSProperties => ({
  opacity: styles.opacity,
  transform: `scale(${styles.scale})`,
});

export default function BouceTransition(props: BounceTransitionProps) {
  const { children } = props;
  return (
    <Motion
      defaultStyle={{ opacity: 0, scale: 1.2 }}
      style={{ opacity: bounce(1), scale: bounce(1) }}
    >
      {(interpolatingStyle) => (
        <div style={mapStyles(interpolatingStyle)}>{children}</div>
      )}
    </Motion>
  );
}

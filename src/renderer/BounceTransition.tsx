import { ReactNode, CSSProperties } from "react";
import { Motion, spring, PlainStyle } from "@serprex/react-motion";

type BounceTransitionProps = {
  children: ReactNode;
  otherStyles?: CSSProperties;
};

function bounce(val: number) {
  return spring(val, {
    stiffness: 330,
    damping: 22,
  });
}

const mapStyles = (styles: PlainStyle): CSSProperties => ({
  opacity: styles.opacity,
  transform: `scale(${styles.scale})`,
});

export default function BouceTransition(props: BounceTransitionProps) {
  const { children, otherStyles } = props;
  return (
    <Motion
      defaultStyle={{ opacity: 0, scale: 1.2 }}
      style={{ opacity: bounce(1), scale: bounce(1) }}
    >
      {(interpolatingStyle) => (
        <div style={{ ...otherStyles, ...mapStyles(interpolatingStyle) }}>
          {children}
        </div>
      )}
    </Motion>
  );
}

BouceTransition.defaultProps = {
  otherStyles: {},
};

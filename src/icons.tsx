import { TablerIcon, TablerIconProps } from "@tabler/icons";

export const IconKillstreak: TablerIcon = ({
  size = 24,
  color = "currentColor",
  stroke = 2,
  ...props
}: TablerIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth={stroke}
    stroke={color}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="m 20,12 -8,8 H 4 L 12,12 4,4 h 8 z" />
    <path d="m 4.5,9 3,3 -3,3 z" fill={color} />
  </svg>
);

export const IconPov: TablerIcon = ({
  size = 24,
  color = "currentColor",
  stroke = 2,
  ...props
}: TablerIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth={stroke}
    stroke={color}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M 3,16 V 8 h 2 m 0,4 H 3" />
    <path d="m 10,10 v 4 m 4,0 v -4" />
    <path d="m 17,8 2,8 2,-8" />
    <path d="m 10,10 a 2,2 0 0 1 2,-2 2,2 0 0 1 2,2" />
    <path d="m 14,14 a 2,2 0 0 1 -1,1.732051 2,2 0 0 1 -2,0 2,2 0 0 1 -1,-1.732051" />
    <path d="m 5,8 a 2,2 0 0 1 2,2 2,2 0 0 1 -2,2" />
  </svg>
);

export const IconStv: TablerIcon = ({
  size = 24,
  color = "currentColor",
  stroke = 2,
  ...props
}: TablerIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="icon icon-tabler"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    strokeWidth={stroke}
    stroke={color}
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M7 8h-3a1 1 0 0 0 -1 1v2a1 1 0 0 0 1 1h2a1 1 0 0 1 1 1v2a1 1 0 0 1 -1 1h-3" />
    <path d="M 12,16 V 8 m -2,0 h 4" />
    <path d="m 17,8 2,8 2,-8" />
  </svg>
);

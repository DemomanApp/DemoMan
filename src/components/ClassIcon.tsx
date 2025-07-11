import { type Class, stringifyClass } from "@/demo";

import DemomanIcon from "@/assets/class_icons/demoman.png";
import EngineerIcon from "@/assets/class_icons/engineer.png";
import HeavyIcon from "@/assets/class_icons/heavy.png";
import MedicIcon from "@/assets/class_icons/medic.png";
import PyroIcon from "@/assets/class_icons/pyro.png";
import ScoutIcon from "@/assets/class_icons/scout.png";
import SniperIcon from "@/assets/class_icons/sniper.png";
import SoldierIcon from "@/assets/class_icons/soldier.png";
import SpyIcon from "@/assets/class_icons/spy.png";

/*
  Class mapping:
  --------------
  Other = 0,
  Scout = 1,
  Sniper = 2,
  Soldier = 3,
  Demoman = 4,
  Medic = 5,
  Heavy = 6,
  Pyro = 7,
  Spy = 8,
  Engineer = 9
*/

const classIconMap = [
  ScoutIcon,
  SniperIcon,
  SoldierIcon,
  DemomanIcon,
  MedicIcon,
  HeavyIcon,
  PyroIcon,
  SpyIcon,
  EngineerIcon,
];

export type ClassIconProps = {
  cls: Class;
  size?: number;
};

export default function ClassIcon({ cls, size = 32 }: ClassIconProps) {
  return (
    <img
      alt={stringifyClass(cls)}
      src={classIconMap[cls]}
      style={{
        width: size,
        height: size,
      }}
    />
  );
}

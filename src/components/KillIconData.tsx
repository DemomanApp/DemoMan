import KillIconMap1 from "@/assets/kill_icons/d_images.png";
import KillIconMap2 from "@/assets/kill_icons/d_images_v2.png";
import KillIconMap3 from "@/assets/kill_icons/d_images_v3.png";
import KillIconMap1Neg from "@/assets/kill_icons/dneg_images.png";
import KillIconMap2Neg from "@/assets/kill_icons/dneg_images_v2.png";
import KillIconMap3Neg from "@/assets/kill_icons/dneg_images_v3.png";

type KillIconDataEntry = {
  iconFile: string;
  iconNegFile: string;
  x: number;
  y: number;
  width: number;
  height: number;
};

const data: Record<string, KillIconDataEntry> = {
  skull_tf: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 116,
    y: 288,
    width: 52,
    height: 32,
  },
  obj_sentrygun: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 160,
    width: 64,
    height: 32,
  },
  obj_sentrygun2: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 256,
    y: 0,
    width: 96,
    height: 32,
  },
  obj_sentrygun3: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 256,
    y: 32,
    width: 96,
    height: 32,
  },
  bat: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 0,
    width: 96,
    height: 32,
  },
  pistol: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 32,
    width: 96,
    height: 32,
  },
  pistol_scout: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 32,
    width: 96,
    height: 32,
  },
  sniperrifle: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 16,
    y: 96,
    width: 32,
    height: 32,
  },
  smg: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 128,
    width: 96,
    height: 32,
  },
  club: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 160,
    width: 96,
    height: 32,
  },
  shovel: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 192,
    width: 96,
    height: 32,
  },
  tf_projectile_rocket: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 224,
    width: 96,
    height: 32,
  },
  shotgun_primary: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 256,
    width: 96,
    height: 32,
  },
  shotgun_soldier: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 256,
    width: 96,
    height: 32,
  },
  shotgun_hwg: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 256,
    width: 96,
    height: 32,
  },
  shotgun_pyro: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 256,
    width: 96,
    height: 32,
  },
  tf_projectile_pipe: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 288,
    width: 96,
    height: 32,
  },
  bottle: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 320,
    width: 96,
    height: 32,
  },
  syringegun_medic: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 352,
    width: 96,
    height: 32,
  },
  minigun: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 384,
    width: 96,
    height: 32,
  },
  flamethrower: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 416,
    width: 96,
    height: 32,
  },
  fists: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 191,
    y: 446,
    width: 64,
    height: 32,
  },
  fireaxe: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 480,
    width: 96,
    height: 32,
  },
  bonesaw: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 128,
    width: 96,
    height: 32,
  },
  knife: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 0,
    width: 96,
    height: 32,
  },
  revolver: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 32,
    width: 96,
    height: 32,
  },
  flaregun: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 64,
    width: 96,
    height: 32,
  },
  wrench: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 96,
    width: 96,
    height: 32,
  },
  scattergun: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 192,
    width: 96,
    height: 32,
  },
  tf_projectile_pipe_remote: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 224,
    width: 96,
    height: 32,
  },
  vehicle: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 256,
    width: 96,
    height: 32,
  },
  skull: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 288,
    width: 96,
    height: 32,
  },
  headshot: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 120,
    y: 352,
    width: 42,
    height: 32,
  },
  backstab: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 116,
    y: 384,
    width: 48,
    height: 32,
  },
  ubersaw: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 416,
    width: 96,
    height: 32,
  },
  axtinguisher: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 448,
    width: 96,
    height: 32,
  },
  taunt_pyro: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 96,
    y: 480,
    width: 96,
    height: 32,
  },
  bluedefend: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 194,
    y: 0,
    width: 32,
    height: 32,
  },
  bluecapture: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 194,
    y: 32,
    width: 32,
    height: 32,
  },
  reddefend: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 226,
    y: 0,
    width: 32,
    height: 32,
  },
  redcapture: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 226,
    y: 32,
    width: 32,
    height: 32,
  },
  obj_attachment_sapper: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 64,
    width: 96,
    height: 32,
  },
  deflect_promode: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 194,
    y: 64,
    width: 64,
    height: 32,
  },
  deflect_sticky: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 194,
    y: 96,
    width: 64,
    height: 32,
  },
  deflect_rocket: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 194,
    y: 128,
    width: 64,
    height: 32,
  },
  deflect_flare: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 194,
    y: 160,
    width: 64,
    height: 32,
  },
  bat_wood: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 0,
    width: 96,
    height: 32,
  },
  ball: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 192,
    y: 192,
    width: 64,
    height: 32,
  },
  taunt_heavy: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 191,
    y: 479,
    width: 64,
    height: 32,
  },
  taunt_scout: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 192,
    y: 224,
    width: 64,
    height: 64,
  },
  gloves: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 0,
    y: 448,
    width: 96,
    height: 32,
  },
  crit: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 192,
    y: 409,
    width: 64,
    height: 34,
  },
  ambassador: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 263,
    y: 67,
    width: 92,
    height: 32,
  },
  huntsman: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 263,
    y: 98,
    width: 96,
    height: 32,
  },
  huntsman_burning: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 263,
    y: 190,
    width: 68,
    height: 33,
  },
  huntsman_flyingburn: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 263,
    y: 223,
    width: 103,
    height: 32,
  },
  taunt_spy: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 263,
    y: 129,
    width: 92,
    height: 32,
  },
  huntsman_headshot: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 192,
    y: 289,
    width: 64,
    height: 32,
  },
  ambassador_headshot: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 192,
    y: 322,
    width: 64,
    height: 32,
  },
  taunt_sniper: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 263,
    y: 161,
    width: 94,
    height: 27,
  },
  saw_kill: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 192,
    y: 359,
    width: 64,
    height: 32,
  },
  deflect_arrow: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 360,
    y: 0,
    width: 64,
    height: 30,
  },
  firedeath: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 263,
    y: 256,
    width: 64,
    height: 32,
  },
  pumpkindeath: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 263,
    y: 358,
    width: 96,
    height: 32,
  },
  taunt_soldier: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 323,
    y: 446,
    width: 64,
    height: 32,
  },
  taunt_demoman: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 323,
    y: 479,
    width: 64,
    height: 32,
  },
  sword: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 258,
    y: 464,
    width: 64,
    height: 32,
  },
  demoshield: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 258,
    y: 398,
    width: 64,
    height: 32,
  },
  pickaxe: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 258,
    y: 431,
    width: 64,
    height: 32,
  },
  rocketlauncher_directhit: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 263,
    width: 92,
    height: 32,
  },
  sticky_resistance: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 323,
    y: 413,
    width: 64,
    height: 32,
  },
  player_sentry: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 388,
    y: 446,
    width: 64,
    height: 32,
  },
  battleaxe: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 164,
    width: 64,
    height: 32,
  },
  tribalkukri: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 65,
    width: 92,
    height: 32,
  },
  sledgehammer: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 98,
    width: 64,
    height: 32,
  },
  paintrain: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 131,
    width: 64,
    height: 32,
  },
  deflect_huntsman_headshot: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 258,
    y: 289,
    width: 64,
    height: 32,
  },
  huntsman_flyingburn_headshot: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 32,
    width: 64,
    height: 32,
  },
  taunt_medic: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 197,
    width: 128,
    height: 32,
  },
  samrevolver: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 230,
    width: 98,
    height: 32,
  },
  natascha: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 297,
    width: 98,
    height: 32,
  },
  maxgun: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 330,
    width: 98,
    height: 32,
  },
  force_a_nature: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 368,
    y: 363,
    width: 128,
    height: 32,
  },
  deflect_huntsman_flyingburn_headshot: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 404,
    y: 396,
    width: 98,
    height: 32,
  },
  deflect_huntsman_flyingburn: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 433,
    y: 32,
    width: 64,
    height: 32,
  },
  deflect_ball: {
    iconFile: KillIconMap1,
    iconNegFile: KillIconMap1Neg,
    x: 433,
    y: 131,
    width: 64,
    height: 32,
  },
  building_carried_destroyed: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 0,
    y: 768,
    width: 96,
    height: 32,
  },
  taunt_guitar_kill: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 0,
    y: 704,
    width: 96,
    height: 32,
  },
  frontier_kill: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 96,
    width: 128,
    height: 32,
  },
  wrench_golden: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 0,
    y: 736,
    width: 96,
    height: 32,
  },
  southern_comfort_kill: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 992,
    width: 64,
    height: 32,
  },
  bleed_kill: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 928,
    width: 32,
    height: 32,
  },
  wrangler_kill: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 960,
    width: 64,
    height: 32,
  },
  robot_arm_kill: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 0,
    y: 800,
    width: 96,
    height: 32,
  },
  robot_arm_combo_kill: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 0,
    y: 832,
    width: 96,
    height: 32,
  },
  robot_arm_blender_kill: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 0,
    y: 864,
    width: 96,
    height: 32,
  },
  degreaser: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 0,
    y: 896,
    width: 96,
    height: 32,
  },
  powerjack: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 0,
    y: 928,
    width: 96,
    height: 32,
  },
  eternal_reward: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 0,
    y: 960,
    width: 96,
    height: 32,
  },
  letranger: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 0,
    y: 992,
    width: 96,
    height: 32,
  },
  shortstop: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 896,
    width: 64,
    height: 32,
  },
  holymackerel: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 96,
    y: 992,
    width: 96,
    height: 32,
  },
  headtaker: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 128,
    width: 128,
    height: 32,
  },
  fryingpan: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 96,
    y: 768,
    width: 96,
    height: 32,
  },
  back_scratcher: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 96,
    y: 800,
    width: 96,
    height: 32,
  },
  boston_basher: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 96,
    y: 832,
    width: 96,
    height: 32,
  },
  claidheamohmor: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 96,
    y: 864,
    width: 96,
    height: 32,
  },
  steel_fists: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 96,
    y: 896,
    width: 96,
    height: 32,
  },
  ullapool_caber_explosion: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 96,
    y: 928,
    width: 96,
    height: 32,
  },
  ullapool_caber: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 96,
    y: 960,
    width: 96,
    height: 32,
  },
  candy_cane: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 768,
    width: 96,
    height: 32,
  },
  amputator: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 800,
    width: 96,
    height: 32,
  },
  blackbox: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 160,
    width: 128,
    height: 32,
  },
  wrench_jag: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 864,
    width: 64,
    height: 32,
  },
  warrior_spirit: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 832,
    width: 96,
    height: 32,
  },
  loch_n_load: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 736,
    width: 96,
    height: 32,
  },
  iron_curtain: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 704,
    width: 96,
    height: 32,
  },
  crusaders_crossbow: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 672,
    width: 96,
    height: 32,
  },
  battleneedle: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 640,
    width: 96,
    height: 32,
  },
  sydney_sleeper: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 192,
    width: 128,
    height: 32,
  },
  cow_mangler: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 224,
    width: 128,
    height: 32,
  },
  righteous_bison: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 256,
    width: 128,
    height: 32,
  },
  bushwacka: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 608,
    width: 96,
    height: 32,
  },
  taunt_soldier_lumbricus: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 320,
    y: 864,
    width: 64,
    height: 32,
  },
  brass_beast: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 576,
    width: 96,
    height: 32,
  },
  gloves_running_urgently: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 544,
    width: 96,
    height: 32,
  },
  blutsauger: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 512,
    width: 96,
    height: 32,
  },
  sandman: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 480,
    width: 96,
    height: 32,
  },
  backburner: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 448,
    width: 96,
    height: 32,
  },
  lava_bat: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 0,
    width: 96,
    height: 32,
  },
  lava_axe: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 32,
    width: 96,
    height: 32,
  },
  obj_minisentry: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 416,
    width: 96,
    height: 32,
  },
  kunai: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 64,
    width: 96,
    height: 32,
  },
  warfan: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 96,
    width: 64,
    height: 32,
  },
  demokatana: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 128,
    width: 96,
    height: 32,
  },
  scout_sword: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 192,
    width: 128,
    height: 32,
  },
  the_maul: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 224,
    width: 96,
    height: 32,
  },
  saxxy: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 256,
    width: 96,
    height: 32,
  },
  market_gardener: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 288,
    width: 96,
    height: 32,
  },
  the_winger: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 320,
    width: 96,
    height: 32,
  },
  tomislav: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 352,
    width: 96,
    height: 32,
  },
  soda_popper: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 384,
    width: 96,
    height: 32,
  },
  atomizer: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 416,
    width: 96,
    height: 32,
  },
  bazaar_bargain: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 448,
    width: 96,
    height: 32,
  },
  big_earner: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 480,
    width: 96,
    height: 32,
  },
  detonator: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 512,
    width: 96,
    height: 32,
  },
  eviction_notice: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 544,
    width: 96,
    height: 32,
  },
  family_business: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 576,
    width: 96,
    height: 32,
  },
  liberty_launcher: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 608,
    width: 96,
    height: 32,
  },
  proto_syringe: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 640,
    width: 96,
    height: 32,
  },
  persian_persuader: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 672,
    width: 96,
    height: 32,
  },
  reserve_shooter: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 704,
    width: 96,
    height: 32,
  },
  shahanshah: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 736,
    width: 96,
    height: 32,
  },
  enforcer: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 768,
    width: 96,
    height: 32,
  },
  disciplinary_action: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 800,
    width: 96,
    height: 32,
  },
  splendid_screen: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 832,
    width: 96,
    height: 32,
  },
  mantreads: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 864,
    width: 64,
    height: 32,
  },
  solemn_vow: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 896,
    width: 96,
    height: 32,
  },
  nessieclub: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 928,
    width: 128,
    height: 32,
  },
  mailbox: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 960,
    width: 128,
    height: 32,
  },
  quake_rl: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 992,
    width: 128,
    height: 32,
  },
  diamondback: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 320,
    y: 896,
    width: 64,
    height: 32,
  },
  widowmaker: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 320,
    y: 960,
    width: 64,
    height: 32,
  },
  short_circuit: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 320,
    y: 928,
    width: 64,
    height: 32,
  },
  machina: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 288,
    width: 128,
    height: 32,
  },
  player_penetration: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 320,
    width: 128,
    height: 32,
  },
  headshot_player_penetration: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 256,
    y: 352,
    width: 128,
    height: 32,
  },
  nonnonviolent_protest: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 0,
    width: 96,
    height: 32,
  },
  scotland_shard: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 32,
    width: 96,
    height: 32,
  },
  baleful_beacon: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 64,
    width: 96,
    height: 32,
  },
  unarmed_combat: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 96,
    width: 96,
    height: 32,
  },
  voodoo_pin: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 128,
    width: 96,
    height: 32,
  },
  eyeball_rocket: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 160,
    width: 96,
    height: 32,
  },
  purgatory: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 192,
    width: 96,
    height: 32,
  },
  apocofists: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 256,
    width: 96,
    height: 32,
  },
  sharp_dresser: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 288,
    width: 96,
    height: 32,
  },
  sharp_dresser_backstab: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 320,
    width: 96,
    height: 32,
  },
  phlogistinator: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 0,
    width: 128,
    height: 32,
  },
  manmelter: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 32,
    width: 128,
    height: 32,
  },
  thirddegree: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 352,
    width: 96,
    height: 32,
  },
  eureka_effect: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 416,
    width: 96,
    height: 32,
  },
  pomson: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 64,
    width: 128,
    height: 32,
  },
  holiday_punch: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 448,
    width: 96,
    height: 32,
  },
  spy_cicle: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 512,
    width: 96,
    height: 32,
  },
  wrap_assassin: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 96,
    width: 128,
    height: 32,
  },
  black_rose: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 576,
    width: 96,
    height: 32,
  },
  lollichop: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 608,
    width: 96,
    height: 32,
  },
  scorch_shot: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 640,
    width: 96,
    height: 32,
  },
  rainblower: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 672,
    width: 96,
    height: 32,
  },
  pro_smg: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 705,
    width: 64,
    height: 31,
  },
  pep_pistol: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 737,
    width: 48,
    height: 31,
  },
  armageddon: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 769,
    width: 96,
    height: 31,
  },
  pro_rifle: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 128,
    width: 128,
    height: 32,
  },
  pep_brawlerblaster: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 160,
    width: 128,
    height: 32,
  },
  dumpster_device: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 192,
    width: 128,
    height: 32,
  },
  long_heatmaker: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 800,
    width: 96,
    height: 31,
  },
  annihilator: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 832,
    width: 96,
    height: 31,
  },
  guillotine: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 864,
    width: 96,
    height: 31,
  },
  recorder: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 896,
    width: 96,
    height: 31,
  },
  loose_cannon_impact: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 928,
    width: 96,
    height: 32,
  },
  freedom_staff: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 224,
    width: 128,
    height: 32,
  },
  merasmus_decap: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 256,
    width: 128,
    height: 32,
  },
  merasmus_zap: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 288,
    width: 128,
    height: 32,
  },
  merasmus_grenade: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 320,
    width: 128,
    height: 32,
  },
  merasmus_player_bomb: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 352,
    width: 128,
    height: 32,
  },
  loose_cannon_explosion: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 384,
    width: 128,
    height: 32,
  },
  rescue_ranger: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 416,
    width: 128,
    height: 32,
  },
  memory_maker: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 0,
    width: 64,
    height: 32,
  },
  loose_cannon_reflect: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 32,
    width: 64,
    height: 32,
  },
  rescue_ranger_reflect: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 64,
    width: 64,
    height: 32,
  },
  ham_shank: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 96,
    width: 64,
    height: 32,
  },
  psapper: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 480,
    width: 128,
    height: 32,
  },
  spellbook_teleport: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 192,
    width: 64,
    height: 32,
  },
  spellbook_skeleton: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 224,
    width: 64,
    height: 32,
  },
  spellbook_mirv: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 256,
    width: 64,
    height: 32,
  },
  spellbook_meteor: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 288,
    width: 64,
    height: 32,
  },
  spellbook_lightning: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 320,
    width: 64,
    height: 32,
  },
  spellbook_fireball: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 352,
    width: 64,
    height: 32,
  },
  spellbook_boss: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 384,
    width: 64,
    height: 32,
  },
  spellbook_blastjump: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 416,
    width: 64,
    height: 32,
  },
  spellbook_bats: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 448,
    width: 64,
    height: 32,
  },
  spellbook_athletic: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 480,
    width: 64,
    height: 32,
  },
  golden_fryingpan: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 96,
    y: 0,
    width: 96,
    height: 32,
  },
  australium: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 512,
    width: 64,
    height: 32,
  },
  the_classic: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 577,
    width: 128,
    height: 32,
  },
  tide_turner: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 545,
    width: 64,
    height: 32,
  },
  bread_bite: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 577,
    width: 64,
    height: 32,
  },
  snack_attack: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 608,
    width: 128,
    height: 32,
  },
  back_scatter: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 512,
    width: 128,
    height: 32,
  },
  airstrike: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 545,
    width: 128,
    height: 32,
  },
  ai_flamethrower: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 640,
    width: 128,
    height: 32,
  },
  necro_smasher: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 608,
    width: 64,
    height: 32,
  },
  bumper_kart: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 640,
    width: 64,
    height: 32,
  },
  crossing_guard: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 960,
    width: 96,
    height: 32,
  },
  iron_bomber: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 672,
    width: 128,
    height: 32,
  },
  quickiebomb_launcher: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 704,
    width: 128,
    height: 32,
  },
  panic_attack: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 736,
    width: 128,
    height: 32,
  },
  // Mannpower
  mannpower_agility: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 96,
    y: 32,
    width: 35,
    height: 32,
  },
  mannpower_vamp: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 96,
    y: 64,
    width: 35,
    height: 32,
  },
  mannpower_resist: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 96,
    y: 96,
    width: 35,
    height: 32,
  },
  mannpower_haste: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 96,
    y: 128,
    width: 35,
    height: 32,
  },
  mannpower_fist: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 96,
    y: 160,
    width: 35,
    height: 32,
  },
  mannpower_reflect: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 128,
    y: 160,
    width: 40,
    height: 32,
  },
  mannpower_precision: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 96,
    y: 224,
    width: 35,
    height: 32,
  },
  mannpower_strength: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 96,
    y: 256,
    width: 35,
    height: 32,
  },
  mannpower_regen: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 96,
    y: 288,
    width: 35,
    height: 32,
  },
  mannpower_king: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 128,
    y: 96,
    width: 40,
    height: 32,
  },
  mannpower_plague: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 128,
    y: 32,
    width: 40,
    height: 32,
  },
  mannpower_supernova: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 128,
    y: 64,
    width: 40,
    height: 32,
  },
  // END Mannpower
  batsaber: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 768,
    width: 128,
    height: 32,
  },
  the_capper: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 800,
    width: 128,
    height: 32,
  },
  shooting_star: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 832,
    width: 128,
    height: 32,
  },
  giger_counter: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 192,
    y: 896,
    width: 64,
    height: 32,
  },
  prinny_machete: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 96,
    y: 864,
    width: 96,
    height: 32,
  },
  crocodile: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 864,
    width: 128,
    height: 32,
  },
  dragons_fury: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 0,
    y: 992,
    width: 96,
    height: 32,
  },
  dragons_fury_bonus: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 992,
    width: 128,
    height: 32,
  },
  hot_hand: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 928,
    width: 64,
    height: 32,
  },
  gas_blast: {
    iconFile: KillIconMap3,
    iconNegFile: KillIconMap3Neg,
    x: 256,
    y: 960,
    width: 64,
    height: 32,
  },
  rocketpack_stomp: {
    iconFile: KillIconMap2,
    iconNegFile: KillIconMap2Neg,
    x: 384,
    y: 864,
    width: 64,
    height: 32,
  },
};

export default data;

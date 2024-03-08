export const weaponsPageBuckets = [
  1498876634, // kinetic weapons
  2465295065, // energy weapons
  953998645, // power weapons
  4023194814, // ghost
  1506418338, // artifact
];

export enum DamageType {
  None = 0,
  Kinetic = 1,
  Arc = 2,
  Solar = 3,
  Void = 4,
  Raid = 5,
  Stasis = 6,
  Strand = 7,
}

export enum BreakerType {
  None = 0,
  ShieldPiercing = 1,
  Disruption = 2,
  Stagger = 3,
}

export type DestinyIconData = {
  itemHash: number;
  itemInstanceId?: string;
  icon: string;
  damageTypeIconUri: number | null;
  primaryStat: number;
  calculatedWaterMark: string | undefined;
};

export enum UiRowType {
  Header = 0,
  CharacterEquipped = 1,
  CharacterInventory = 2,
  VaultInventory = 3,
}

export type CharacterEquippedRow = {
  id: string;
  equipped: DestinyIconData | null;
  inventory: Array<DestinyIconData>;
  type: UiRowType.CharacterEquipped;
};

export type CharacterInventoryRow = {
  id: string;
  inventory: Array<DestinyIconData>;
  type: UiRowType.CharacterInventory;
};

export type VaultInventoryRow = {
  id: string;
  inventory: Array<DestinyIconData>;
  type: UiRowType.VaultInventory;
};

export type HeaderRow = {
  id: string;
  type: UiRowType.Header;
};

export type UiRow = HeaderRow | CharacterEquippedRow | CharacterInventoryRow | VaultInventoryRow;

export const ITEM_SIZE = 90;
export const SEPARATOR_SIZE = 45;

const SOLAR_MINI_ICON_URI = require("../../images/solar_mini.webp");
const VOID_MINI_ICON_URI = require("../../images/void_mini.webp");
const ARC_MINI_ICON_URI = require("../../images/arc_mini.webp");
const KINETIC_MINI_ICON_URI = require("../../images/kinetic_mini.webp");
const STASIS_MINI_ICON_URI = require("../../images/stasis_mini.webp");
const STRAND_MINI_ICON_URI = require("../../images/strand_mini.webp");

export function getDamagetypeIconUri(damageType: DamageType): number | null {
  switch (damageType) {
    case DamageType.Solar:
      return SOLAR_MINI_ICON_URI;
    case DamageType.Arc:
      return ARC_MINI_ICON_URI;
    case DamageType.Void:
      return VOID_MINI_ICON_URI;
    case DamageType.Stasis:
      return STASIS_MINI_ICON_URI;
    case DamageType.Strand:
      return STRAND_MINI_ICON_URI;
    default:
      return null;
  }
}

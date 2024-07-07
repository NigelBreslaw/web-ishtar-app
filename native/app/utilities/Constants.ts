import { SectionBuckets } from "@/app/bungie/Enums.ts";
import type { CharacterId } from "@/app/core/GetProfile.ts";

export function updateBucketSizes() {
  BUCKET_SIZES[SectionBuckets.Consumables] =
    DestinyInventoryBucketDefinition[SectionBuckets.Consumables]?.itemCount ?? 5;
  BUCKET_SIZES[SectionBuckets.Mods] = DestinyInventoryBucketDefinition[SectionBuckets.Mods]?.itemCount ?? 5;
  BUCKET_SIZES[SectionBuckets.LostItem] = DestinyInventoryBucketDefinition[SectionBuckets.LostItem]?.itemCount ?? 5;
  BUCKET_SIZES[SectionBuckets.Vault] = DestinyInventoryBucketDefinition[SectionBuckets.Vault]?.itemCount ?? 5;
}

export function updateDestinyText() {
  DESTINY_TEXT.POWER = DestinyStatDefinition[1935470627]?.displayProperties.name ?? "";
}

export const VAULT_CHARACTER_ID = "VAULT" as CharacterId;
export const GLOBAL_MODS_CHARACTER_ID = "GLOBAL_MODS_CHARACTER_ID" as CharacterId;
export const GLOBAL_CONSUMABLES_CHARACTER_ID = "GLOBAL_CONSUMABLES_CHARACTER_ID" as CharacterId;
export const GLOBAL_LOST_ITEMS_CHARACTER_ID = "GLOBAL_LOST_ITEMS_CHARACTER_ID" as CharacterId;

export const GLOBAL_INVENTORY_NAMES = [
  GLOBAL_MODS_CHARACTER_ID,
  GLOBAL_CONSUMABLES_CHARACTER_ID,
  GLOBAL_LOST_ITEMS_CHARACTER_ID,
];

export const BUCKET_SIZES = {
  [SectionBuckets.Consumables]: 50,
  [SectionBuckets.Mods]: 50,
  [SectionBuckets.LostItem]: 21,
  [SectionBuckets.Vault]: 500,
};

export const DESTINY_TEXT = {
  POWER: "",
};

import { DamageType } from "@/app/bungie/Enums.ts";
import { DestinyInventoryBucketDefinition, DestinyStatDefinition } from "@/app/store/Definitions.ts";

export const DEFAULT_OVERLAP_COLOR = "#242429CC";

export const LOGO_DARK = require("../../images/gg-logo-dark.webp");
export const LOGO_LIGHT = require("../../images/gg-logo-light.webp");
export const CRAFTED_OVERLAY = require("../../images/crafted.webp");
export const ENHANCED_OVERLAY = require("../../images/enhanced.webp");
export const EMPTY_ENGRAM = require("../../images/engram-empty.webp");
export const GLOBAL_SPACE_EMBLEM = require("../../images/globalEmblem.webp");
export const vaultEmblemBackgroundPath = require("../../images/vaultEmblem.webp");
export const vaultEmblemPath = require("../../images/vault-emblem-button.png");
export const vaultSecondarySpecial = require("../../images/vaultSecondary.webp");
export const REFRESH_ICON = require("../../images/icons/refresh.webp");
export const SEARCH_ICON = require("../../images/icons/search.png");
export const ENHANCED_TRAIT = require("../../images/enhanced-trait.png");
export const POWER_LEVEL = require("../../images/icons/power-icon.png");

const SOLAR_MINI_ICON_URI = require("../../images/damage/solar_mini.webp");
const VOID_MINI_ICON_URI = require("../../images/damage/void_mini.webp");
const ARC_MINI_ICON_URI = require("../../images/damage/arc_mini.webp");
const _KINETIC_MINI_ICON_URI = require("../../images/damage/kinetic_mini.webp");
const STASIS_ICON_URI = require("../../images/damage/stasis_mini.webp");
const STRAND_ICON_URI = require("../../images/damage/strand_mini.webp");
const SOLAR_ICON_URI = require("../../images/damage/solar_mini.webp");
const VOID_ICON_URI = require("../../images/damage/void_mini.webp");
const ARC_ICON_URI = require("../../images/damage/arc_mini.webp");
const STASIS_MINI_ICON_URI = require("../../images/damage/stasis_mini.webp");
const STRAND_MINI_ICON_URI = require("../../images/damage/strand_mini.webp");
export const MASTERWORK_TRIM = require("../../images/details-masterwork-trim.png");
export const SCREENSHOT_MASTERWORK_OVERLAY = require("../../images/masterwork-landscape-overlay.png");
export const LARGE_CRAFTED = require("../../images/large-crafted.webp");
export const LARGE_ENHANCED = require("../../images/large-enhanced.webp");

export function getDamageTypeIconUri(damageType: DamageType | undefined): number | null {
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

export function getLargeDamageTypeIconUri(damageType: DamageType | undefined): number | null {
  switch (damageType) {
    case DamageType.Solar:
      return SOLAR_ICON_URI;
    case DamageType.Arc:
      return ARC_ICON_URI;
    case DamageType.Void:
      return VOID_ICON_URI;
    case DamageType.Stasis:
      return STASIS_ICON_URI;
    case DamageType.Strand:
      return STRAND_ICON_URI;
    default:
      return null;
  }
}

// Objectives icons
export const ARC_OBJECTIVE_ICON = require("../../images/objectives/arc.png");
export const AUTO_RIFLE_OBJECTIVE_ICON = require("../../images/objectives/auto rifle.png");
export const BOW_OBJECTIVE_ICON = require("../../images/objectives/bow.png");
export const CURRENCY_OBJECTIVE_ICON = require("../../images/objectives/currency.png");
export const FINAL_BLOWS_OBJECTIVE_ICON = require("../../images/objectives/final blows.png");
export const FUSION_OBJECTIVE_ICON = require("../../images/objectives/fusion.png");
export const GLAIVE_OBJECTIVE_ICON = require("../../images/objectives/glaive.png");
export const GRENADE_OBJECTIVE_ICON = require("../../images/objectives/grenade.png");
export const GRENADE_LAUNCHER_OBJECTIVE_ICON = require("../../images/objectives/grenade launcher.png");
export const HAND_CANNON_OBJECTIVE_ICON = require("../../images/objectives/hand cannon.png");
export const HEADSHOT_OBJECTIVE_ICON = require("../../images/objectives/headshot.png");
export const LARGE_BLOCKER_OBJECTIVE_ICON = require("../../images/objectives/large blocker.png");
export const LINEAR_FUSION_OBJECTIVE_ICON = require("../../images/objectives/linear fusion.png");
export const LOST_SECTOR_OBJECTIVE_ICON = require("../../images/objectives/lost sector.png");
export const MACHINE_GUN_OBJECTIVE_ICON = require("../../images/objectives/machine gun.png");
export const MEDIUM_BLOCKER_OBJECTIVE_ICON = require("../../images/objectives/medium blocker.png");
export const MELEE_OBJECTIVE_ICON = require("../../images/objectives/melee.png");
export const PULSE_RIFLE_OBJECTIVE_ICON = require("../../images/objectives/pulse rifle.png");
export const QUEST_OBJECTIVE_ICON = require("../../images/objectives/quest.png");
export const ROCKET_LAUNCHER_OBJECTIVE_ICON = require("../../images/objectives/rocket launcher.png");
export const SCOUT_RIFLE_OBJECTIVE_ICON = require("../../images/objectives/scout rifle.png");
export const SHOTGUN_OBJECTIVE_ICON = require("../../images/objectives/shotgun.png");
export const SIDEARM_OBJECTIVE_ICON = require("../../images/objectives/sidearm.png");
export const SMALL_BLOCKER_OBJECTIVE_ICON = require("../../images/objectives/small blocker.png");
export const SMG_OBJECTIVE_ICON = require("../../images/objectives/smg.png");
export const SNIPER_RIFLE_OBJECTIVE_ICON = require("../../images/objectives/sniper rifle.png");
export const SOLAR_OBJECTIVE_ICON = require("../../images/objectives/solar.png");
export const SPECIAL_GRENADE_LAUNCHER_OBJECTIVE_ICON = require("../../images/objectives/special grenade launcher.png");
export const STASIS_OBJECTIVE_ICON = require("../../images/objectives/stasis.png");
export const SWORD_OBJECTIVE_ICON = require("../../images/objectives/sword.png");
export const TRACE_RIFLE_OBJECTIVE_ICON = require("../../images/objectives/trace rifle.png");
export const VOID_OBJECTIVE_ICON = require("../../images/objectives/void.png");

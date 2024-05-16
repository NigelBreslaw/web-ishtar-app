import {
  characterBuckets,
  type DestinyItem,
  type DestinyItemDefinition,
  type ItemInstance,
  type GGCharacterUiData,
  type Guardian,
  type VaultData,
  type StatsCollection,
  type GuardianGear,
} from "@/app/inventory/logic/Types.ts";
import { findDestinyItem, findMaxQuantityToTransfer, getCharactersAndVault } from "@/app/store/AccountLogic.ts";
import {
  PlugCategoryIdentifier,
  BucketTypeHashArray,
  IconWaterMarks,
  itemsDefinition,
  rawProfileData,
  setConsumables,
  setGeneralVault,
  setGuardians,
  setLostItems,
  setMods,
  setRawProfileData,
  StackUniqueLabel,
  Icons,
  StatGroupHash,
  StatHash,
  TraitIds,
  ItemTypeDisplayName,
} from "@/app/store/Definitions.ts";
import {
  GLOBAL_CONSUMABLES_CHARACTER_ID,
  GLOBAL_LOST_ITEMS_CHARACTER_ID,
  GLOBAL_MODS_CHARACTER_ID,
  VAULT_CHARACTER_ID,
} from "@/app/utilities/Constants.ts";
import type { StateCreator } from "zustand";
import type { IStore } from "@/app/store/GGStore.ts";
import {
  addInventoryItem,
  hasSocketedResonance,
  removeInventoryItem,
  swapEquipAndInventoryItem,
  transformSuccessfulPullFromPostmasterItem,
  updateAllPages,
} from "@/app/store/AccountInventoryLogic.ts";
import { bitmaskContains } from "@/app/utilities/Helpers.ts";
import { create } from "mutative";
import type { DestinyItemBase, ProfileData } from "@/app/core/GetProfile.ts";
import type { DestinyItemIdentifier, UISections } from "@/app/inventory/logic/Helpers.ts";
import { iconUrl, screenshotUrl } from "@/app/core/ApiResponse.ts";
import { DamageType, DestinyClass, ItemSubType, ItemType, SectionBuckets, TierType } from "@/app/bungie/Enums.ts";

export type AccountSliceSetter = Parameters<StateCreator<IStore, [], [], AccountSlice>>[0];
export type AccountSliceGetter = Parameters<StateCreator<IStore, [], [], AccountSlice>>[1];

export interface AccountSlice {
  appStartupTime: number;
  refreshing: boolean;
  pullRefreshing: boolean;
  lastRefreshTime: number;
  currentListIndex: number;
  animateToInventoryPage: { index: number; animate: boolean };

  ggCharacters: GGCharacterUiData[];
  ggWeapons: UISections[][];
  ggArmor: UISections[][];
  ggGeneral: UISections[][];

  selectedItem: DestinyItem | null;
  quantityToTransfer: number;

  responseMintedTimestamp: Date;
  secondaryComponentsMintedTimestamp: Date;

  setAppStartupTime: (appStartupTime: number) => void;
  setRefreshing: (refreshing: boolean) => void;
  setPullRefreshing: (pullRefreshing: boolean) => void;
  setCurrentListIndex: (payload: number) => void;
  setJumpToIndex: (payload: { index: number; animate: boolean }) => void;
  updateProfile: (profile: ProfileData) => void;
  setQuantityToTransfer: (quantityToTransfer: number) => void;
  setTimestamps: (responseMintedTimestamp: string, secondaryComponentsMintedTimestamp: string) => void;
  moveItem: (updatedDestinyItem: DestinyItem, stackableQuantityToMove: number) => void;
  equipItem: (updatedDestinyItem: DestinyItem) => void;
  pullFromPostmaster: (updatedDestinyItem: DestinyItem, stackableQuantityToMove: number) => DestinyItem;
  findDestinyItem: (itemDetails: DestinyItemIdentifier) => DestinyItem;
  findMaxQuantityToTransfer: (destinyItem: DestinyItem) => number;
  setSecondarySpecial: (characterId: string, itemHash: number) => void;
  setLastRefreshTime: () => void;
  setDemoMode: () => Promise<void>;
}

export const createAccountSlice: StateCreator<IStore, [], [], AccountSlice> = (set, get) => ({
  appStartupTime: 0,
  refreshing: false,
  pullRefreshing: false,
  lastRefreshTime: 0,
  currentListIndex: 0,
  animateToInventoryPage: { index: 0, animate: false },

  ggCharacters: [],
  ggWeapons: [],
  ggArmor: [],
  ggGeneral: [],

  selectedItem: null,
  quantityToTransfer: 1,

  responseMintedTimestamp: new Date(1977),
  secondaryComponentsMintedTimestamp: new Date(1977),
  rawProfileData: null,

  setAppStartupTime: (appStartupTime) => set({ appStartupTime }),
  setRefreshing: (refreshing) => set({ refreshing }),
  setPullRefreshing: (pullRefreshing) => set({ pullRefreshing }),

  setCurrentListIndex: (currentListIndex) => {
    set({ currentListIndex, animateToInventoryPage: { index: currentListIndex, animate: false } });
  },
  setJumpToIndex: (jumpToIndex) => {
    set({ animateToInventoryPage: jumpToIndex });
  },

  updateProfile: (profile) => {
    updateProfile(get, set, profile);
  },

  setQuantityToTransfer: (quantityToTransfer) => {
    set({ quantityToTransfer });
  },

  findMaxQuantityToTransfer: (destinyItem) => {
    const maxQuantityToTransfer = findMaxQuantityToTransfer(destinyItem);
    return maxQuantityToTransfer;
  },

  setTimestamps: (responseMintedTimestamp, secondaryComponentsMintedTimestamp) =>
    setTimestamps(set, responseMintedTimestamp, secondaryComponentsMintedTimestamp),

  moveItem: (updatedDestinyItem, stackableQuantityToMove) => {
    removeInventoryItem(updatedDestinyItem, stackableQuantityToMove);
    addInventoryItem(updatedDestinyItem, stackableQuantityToMove);
    updateAllPages(get, set);
  },
  equipItem: (updatedDestinyItem) => {
    swapEquipAndInventoryItem(updatedDestinyItem);
    updateAllPages(get, set);
  },
  pullFromPostmaster: (updatedDestinyItem, stackableQuantityToMove) => {
    // remove the item from the lost items
    removeInventoryItem(updatedDestinyItem, stackableQuantityToMove);
    // Mutate the item to be part of the characters items or a global bucket
    const transformedItem = transformSuccessfulPullFromPostmasterItem(updatedDestinyItem);
    // Add the item back
    addInventoryItem(transformedItem, stackableQuantityToMove);

    updateAllPages(get, set);

    return transformedItem;
  },

  findDestinyItem: (itemDetails) =>
    findDestinyItem({
      itemHash: itemDetails.itemHash,
      itemInstanceId: itemDetails.itemInstanceId,
      characterId: itemDetails.characterId,
      bucketHash: itemDetails.bucketHash,
    }),

  setSecondarySpecial: (characterId, itemHash) => {
    const character = get().ggCharacters.find((c) => c.characterId === characterId);
    if (character) {
      const itemDefinition = itemsDefinition[itemHash];
      if (itemDefinition?.ss) {
        character.secondarySpecial = `${iconUrl}${itemDefinition.ss}`;
      }
    }
  },

  setLastRefreshTime: () => {
    set({ lastRefreshTime: performance.now() });
  },

  setDemoMode: async () => {
    set({ authenticated: "DEMO-MODE" });
    const demoData = await fetch("https://app.guardianghost.com/json/demo.json");
    updateProfile(get, set, await demoData.json());
  },
});

function updateProfile(get: AccountSliceGetter, set: AccountSliceSetter, profile: ProfileData) {
  // set the data first as many other functions need to use the latest version
  setRawProfileData(profile);

  get().setTimestamps(profile.Response.responseMintedTimestamp, profile.Response.secondaryComponentsMintedTimestamp);
  const basicGuardians = createInitialGuardiansData(profile);
  const newGGCharacters = getCharactersAndVault(basicGuardians);
  const previousGGCharacters = get().ggCharacters;
  if (previousGGCharacters.length === 0) {
    set({ ggCharacters: newGGCharacters });
  } else {
    const ggCharacters = create(previousGGCharacters, (draft) => {
      draft.forEach((ggCharacter, index) => {
        ggCharacter.emblemBackgroundPath = newGGCharacters[index]?.emblemBackgroundPath ?? "";
        ggCharacter.emblemPath = newGGCharacters[index]?.emblemPath ?? "";
        ggCharacter.secondarySpecial = newGGCharacters[index]?.secondarySpecial ?? "";
      });
    });
    set({ ggCharacters });
  }

  const p1 = performance.now();
  const guardiansWithEquipment = processCharacterEquipment(get, profile, basicGuardians);
  const guardiansWithInventory = processCharacterInventory(profile, guardiansWithEquipment);
  const vaultData = processVaultInventory(profile);
  const p2 = performance.now();
  console.info("process Inventory took:", `${(p2 - p1).toFixed(4)} ms`);

  setLostItems(vaultData.lostItems);
  setConsumables(vaultData.consumables);
  setMods(vaultData.mods);
  setGeneralVault(vaultData.generalVault);
  setGuardians(guardiansWithInventory);
  updateAllPages(get, set);
}

function setTimestamps(
  set: AccountSliceSetter,
  responseMintedTimestamp: string,
  secondaryComponentsMintedTimestamp: string,
) {
  set((state) => {
    const rmTimestamp = new Date(responseMintedTimestamp);
    const scmTimestamp = new Date(secondaryComponentsMintedTimestamp);
    const previousResponseMintedTimestamp = state.responseMintedTimestamp;
    const previousSecondaryComponentsMintedTimestamp = state.secondaryComponentsMintedTimestamp;

    // check new are newer than previous
    if (
      rmTimestamp.getTime() > previousResponseMintedTimestamp.getTime() &&
      scmTimestamp.getTime() > previousSecondaryComponentsMintedTimestamp.getTime()
    ) {
      return { responseMintedTimestamp: rmTimestamp, secondaryComponentsMintedTimestamp: scmTimestamp };
    }

    console.log("No new timestamps", rmTimestamp, previousResponseMintedTimestamp);
    console.log("No new timestamps", scmTimestamp, previousSecondaryComponentsMintedTimestamp);
    // Should be impossible as BungieApi.ts -> getFullProfile() already did this check.
    throw new Error("No new timestamps");
  });
}

function createInitialGuardiansData(profile: ProfileData): Map<string, Guardian> {
  const characters = profile.Response.characters.data;
  const guardians: Map<string, Guardian> = new Map<string, Guardian>();
  for (const character in characters) {
    const characterData = characters[character];

    if (characterData) {
      const initialCharacterData = {
        data: characterData,
        items: new Map<number, GuardianGear>(),
      };

      for (const bucket of characterBuckets) {
        initialCharacterData.items.set(bucket, { equipped: null, inventory: [] });
      }

      guardians.set(character, initialCharacterData);
    }
  }
  return guardians;
}

function processCharacterEquipment(
  get: AccountSliceGetter,
  profile: ProfileData,
  guardians: Map<string, Guardian>,
): Map<string, Guardian> {
  const charactersEquipment = profile.Response.characterEquipment.data;
  for (const character in charactersEquipment) {
    const characterEquipment = charactersEquipment[character];
    const characterAsId = { characterId: character, equipped: true };

    if (characterEquipment) {
      const characterItems = guardians.get(character);
      if (!characterItems) {
        throw new Error("Character items not found");
      }
      // create all the sections first
      for (const bucket of characterBuckets) {
        characterItems.items.set(bucket, { equipped: null, inventory: [] });
      }
      for (const item of characterEquipment.items) {
        if (characterItems) {
          try {
            const destinyItem = addDefinition(item, characterAsId);
            characterItems.items.set(item.bucketHash, { equipped: destinyItem, inventory: [] });
            if (item.bucketHash === SectionBuckets.Emblem) {
              if (item.overrideStyleItemHash) {
                get().setSecondarySpecial(character, item.overrideStyleItemHash);
              } else {
                get().setSecondarySpecial(character, item.itemHash);
              }
            }
          } catch {}
        }
      }
    }
  }
  return guardians;
}

function processCharacterInventory(profile: ProfileData, guardians: Map<string, Guardian>): Map<string, Guardian> {
  const charactersInventory = profile.Response.characterInventories.data;

  for (const character in charactersInventory) {
    const characterInventory = charactersInventory[character];
    const characterAsId = { characterId: character, equipped: false, previousCharacterId: "" };

    if (characterInventory) {
      const characterItems = guardians.get(character);
      for (const item of characterInventory.items) {
        if (characterItems) {
          try {
            const destinyItem = addDefinition(item, characterAsId);
            characterItems.items.get(item.bucketHash)?.inventory.push(destinyItem);
          } catch {}
        }
      }
    }
  }
  return guardians;
}

function addDefinition(baseItem: DestinyItemBase, extras: { characterId: string; equipped: boolean }): DestinyItem {
  const itemInstance: ItemInstance = {
    icon: "",
    screenshot: "",
    damageType: DamageType.None,
    deepSightResonance: false,
    masterwork: false,
    primaryStat: 0,
  };

  const definitionItem = getItemDefinition(baseItem.itemHash);

  if (baseItem.overrideStyleItemHash !== undefined) {
    const overrideDef = getItemDefinition(baseItem.overrideStyleItemHash);

    if (overrideDef) {
      itemInstance.icon = overrideDef.icon;
      itemInstance.screenshot = overrideDef.screenshot;
    }
  } else {
    itemInstance.icon = definitionItem.icon;
    itemInstance.screenshot = definitionItem.screenshot;
  }

  if (baseItem.versionNumber !== undefined) {
    itemInstance.calculatedWaterMark = definitionItem.displayVersionWatermarkIcons[baseItem.versionNumber];
  } else {
    itemInstance.calculatedWaterMark = definitionItem.watermark;
  }

  const masterwork = bitmaskContains(baseItem.state, 4);
  if (masterwork) {
    itemInstance.masterwork = true;
  }

  const destinyItem = Object.assign(baseItem, extras, {
    def: definitionItem,
    instance: itemInstance,
    previousCharacterId: "",
  });

  if (baseItem.itemInstanceId !== undefined) {
    const itemComponent = rawProfileData?.Response.itemComponents.instances.data[baseItem.itemInstanceId];
    if (itemComponent) {
      if (
        definitionItem.itemType === ItemType.Weapon ||
        definitionItem.itemType === ItemType.Armor ||
        definitionItem.itemType === ItemType.Vehicle ||
        definitionItem.itemType === ItemType.SeasonalArtifact
      ) {
        const primaryStat = itemComponent.primaryStat?.value;
        if (primaryStat) {
          itemInstance.primaryStat = primaryStat;
        }
        if (definitionItem.itemType === ItemType.Weapon) {
          const deepSightResonance = hasSocketedResonance(baseItem.itemInstanceId);
          if (deepSightResonance) {
            itemInstance.deepSightResonance = true;
          }
          itemInstance.damageType = itemComponent.damageType;
          const crafted = bitmaskContains(baseItem.state, 8);
          if (crafted) {
            itemInstance.crafted = true;
            itemInstance.masterwork = checkForCraftedMasterwork(destinyItem);
          }
        }
      }
      if (definitionItem.itemType === ItemType.Engram) {
        const itemLevel = itemComponent.itemLevel * 10;
        const quality = itemComponent.quality;
        const total = itemLevel + quality;
        if (total > 0) {
          itemInstance.primaryStat = Math.max(1600, itemLevel + quality);
        }
      }
    }
  }
  addSpecialSearchClues(destinyItem);

  return destinyItem;
}

function addSpecialSearchClues(destinyItem: DestinyItem) {
  if (destinyItem.instance.masterwork) {
    destinyItem.def.search += "masterworked";
  }
  if (destinyItem.instance.crafted) {
    destinyItem.def.search += "crafted";
  }
  destinyItem.def.search += returnDamageType(destinyItem.instance.damageType);
}

function returnDamageType(damageType: DamageType | undefined): string {
  switch (damageType) {
    case DamageType.None:
      return "";
    case DamageType.Kinetic:
      return "kinetic";
    case DamageType.Arc:
      return "arc";
    case DamageType.Solar:
      return "solar";
    case DamageType.Void:
      return "void";
    case DamageType.Stasis:
      return "stasis";
    case DamageType.Strand:
      return "strand";
    default:
      return "";
  }
}

const itemDefinitionCache = new Map<number, DestinyItemDefinition>();

export function getItemDefinition(itemHash: number): DestinyItemDefinition {
  if (itemDefinitionCache.has(itemHash)) {
    return itemDefinitionCache.get(itemHash)!;
  }

  const definitionItem: DestinyItemDefinition = {
    destinyClass: DestinyClass.Unknown,
    displayVersionWatermarkIcons: [],
    doesPostmasterPullHaveSideEffects: false,
    equippable: false,
    icon: "",
    investmentStats: [],
    itemSubType: ItemSubType.None,
    itemType: ItemType.None,
    itemTypeDisplayName: "",
    maxStackSize: 1,
    name: "",
    nonTransferrable: false,
    plugCategoryIdentifier: "",
    recoveryBucketHash: -1,
    screenshot: "",
    stackUniqueLabel: "",
    statGroupHash: -1,
    stats: [],
    tierType: TierType.Unknown,
    traitIds: [],
    watermark: "",
    search: "",
  };

  const itemDef = itemsDefinition[itemHash];
  if (!itemDef) {
    itemDefinitionCache.set(itemHash, definitionItem);
    return definitionItem;
  }

  if (itemDef?.i) {
    const icon = Icons[itemDef.i];
    definitionItem.icon = `${iconUrl}${icon}`;
  }

  if (itemDef?.itd) {
    definitionItem.itemTypeDisplayName = ItemTypeDisplayName[itemDef.itd]!;
    definitionItem.search = definitionItem.search + definitionItem.itemTypeDisplayName.toLowerCase();
  }

  if (itemDef?.s) {
    definitionItem.screenshot = `${screenshotUrl}${itemDef.s}`;
  }

  if (itemDef?.iw) {
    const waterMark = IconWaterMarks[itemDef.iw];
    definitionItem.watermark = `${iconUrl}${waterMark}`;
  }

  const dvwi = itemDef.dvwi;
  if (dvwi) {
    for (const w of dvwi) {
      const wm = IconWaterMarks[w];
      if (wm) {
        definitionItem.displayVersionWatermarkIcons.push(`${iconUrl}${wm}`);
      }
    }
  }

  const investmentStats: StatsCollection[] = [];
  const investments = itemDef.iv;
  if (investments) {
    for (const iv of Object.keys(investments)) {
      const statTypeHash = Number(StatHash[Number(iv)]);
      const value = investments[iv] ?? 0;
      investmentStats.push({ statTypeHash, value });
    }

    definitionItem.investmentStats = investmentStats;
  }

  const stats: StatsCollection[] = [];
  const itemStats = itemDef.st?.s;
  if (itemStats) {
    for (const s of Object.keys(itemStats)) {
      const statTypeHash = Number(StatHash[Number(s)]);
      const value = itemStats[s] ?? 0;
      stats.push({ statTypeHash, value });
    }
    definitionItem.stats = stats;
  }

  const traitIds: string[] = [];
  const traitDef = itemDef?.tI;
  if (traitDef) {
    for (const trait of traitDef) {
      const traitIndex = trait;
      const traitId = TraitIds[traitIndex]!;
      if (traitId) {
        traitIds.push(traitId);
      }
    }
  }
  definitionItem.traitIds = traitIds;

  const statGroupHashIndex = itemDef.st?.sgs;
  if (statGroupHashIndex) {
    definitionItem.statGroupHash = StatGroupHash[statGroupHashIndex]!;
  }
  const bucketTypeIndex = itemDef.b;
  if (bucketTypeIndex) {
    definitionItem.recoveryBucketHash = BucketTypeHashArray[bucketTypeIndex] ?? 0;
  }
  definitionItem.name = itemDef?.n ?? "";

  definitionItem.search = definitionItem.search + definitionItem.name.toLowerCase();
  definitionItem.itemType = itemDef?.it ?? ItemType.None;
  definitionItem.itemSubType = itemDef?.is ?? 0;
  definitionItem.tierType = itemDef?.t ?? 0;
  definitionItem.destinyClass = itemDef?.c ?? 3;
  definitionItem.doesPostmasterPullHaveSideEffects = !!itemDef?.pm;
  definitionItem.maxStackSize = itemDef?.m ?? 1;
  definitionItem.stackUniqueLabel = itemDef?.su !== undefined ? StackUniqueLabel[itemDef.su] : undefined;
  definitionItem.nonTransferrable = itemDef?.nt === 1;
  definitionItem.equippable = itemDef?.e === 1;
  if (itemDef.p?.p) {
    definitionItem.plugCategoryIdentifier = PlugCategoryIdentifier[itemDef.p.p] ?? "";
  }

  itemDefinitionCache.set(itemHash, definitionItem);
  return definitionItem;
}

// This function takes a lot of assumptions to work out if a crafted item has 2 enhanced perks
function checkForCraftedMasterwork(destinyItem: DestinyItem): boolean {
  // The enhanced plugs will be in the items reusable plugs
  const itemInstanceId = destinyItem.itemInstanceId;
  if (itemInstanceId) {
    if (destinyItem.def.tierType === TierType.Exotic) {
      const liveSockets = rawProfileData?.Response.itemComponents.sockets.data[itemInstanceId]?.sockets;
      if (!liveSockets) {
        return false;
      }
      for (const socket of liveSockets) {
        if (socket.plugHash) {
          const socketDef = getItemDefinition(socket.plugHash);
          if (socketDef.traitIds.includes("item.exotic_catalyst") && socket.isEnabled) {
            return true;
          }
        }
      }
    } else {
      const reusablePlugs = rawProfileData?.Response.itemComponents.reusablePlugs.data[itemInstanceId]?.plugs;
      if (!reusablePlugs) {
        return false;
      }
      // In the dictionary items "3" and "4" are currently the only slots for enhanced plugs.
      // Even though there can be an array, presume position 0 is the only valid one.
      // Get the plugItemHash
      const third = reusablePlugs["3"]?.[0]?.plugItemHash;
      const fourth = reusablePlugs["4"]?.[0]?.plugItemHash;

      if (!third || !fourth) {
        return false;
      }

      // If the tierType is equal to 3 it is enhanced
      const thirdSocketIsEnhanced = itemsDefinition[third]?.t === 3;
      const fourthSocketIsEnhanced = itemsDefinition[fourth]?.t === 3;

      return thirdSocketIsEnhanced && fourthSocketIsEnhanced;
    }
  }
  return false;
}

function processVaultInventory(profile: ProfileData): VaultData {
  const vaultInventory = profile.Response.profileInventory.data.items;

  const characterIsVault = {
    characterId: VAULT_CHARACTER_ID,
    equipped: false,
  };
  const characterIsGlobalMods = {
    characterId: GLOBAL_MODS_CHARACTER_ID,
    equipped: false,
  };

  const characterIsGlobalConsumables = {
    characterId: GLOBAL_CONSUMABLES_CHARACTER_ID,
    equipped: false,
  };

  const characterIsGlobalLostItems = {
    characterId: GLOBAL_LOST_ITEMS_CHARACTER_ID,
    equipped: false,
  };

  const vaultData: VaultData = {
    generalVault: new Map<number, DestinyItem[]>(),
    consumables: [],
    mods: [],
    lostItems: [],
  };

  // create all the sections first
  for (const bucket of characterBuckets) {
    vaultData.generalVault.set(bucket, []);
  }

  if (vaultInventory) {
    for (const item of vaultInventory) {
      let destinyItem: DestinyItem;

      switch (item.bucketHash) {
        case 138197802:
          try {
            destinyItem = addDefinition(item, characterIsVault);
            destinyItem.bucketHash = destinyItem.def.recoveryBucketHash ?? 0;

            if (destinyItem.bucketHash !== 0) {
              vaultData.generalVault.get(destinyItem.bucketHash)?.push(destinyItem);
            }
          } catch {
            continue;
          }
          break;
        case SectionBuckets.Consumables:
          destinyItem = addDefinition(item, characterIsGlobalConsumables);
          vaultData.consumables.push(destinyItem);
          break;
        case SectionBuckets.Mods:
          destinyItem = addDefinition(item, characterIsGlobalMods);
          vaultData.mods.push(destinyItem);
          break;
        default:
          destinyItem = addDefinition(item, characterIsGlobalLostItems);
          vaultData.lostItems.push(destinyItem);
          break;
      }
    }
  }
  return vaultData;
}

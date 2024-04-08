import BlankCell from "@/app/inventory/BlankCell.tsx";
import { type UiCell, UiCellType } from "@/app/inventory/Common.ts";
import DestinyCell from "@/app/inventory/DestinyCell.tsx";
import EmptyCell from "@/app/inventory/EmptyCell.tsx";
import SeparatorRow from "@/app/inventory/SeparatorRow";

export const UiCellRenderItem = ({ item }: { item: UiCell }) => {
  switch (item.type) {
    case UiCellType.Separator:
      return <SeparatorRow />;
    case UiCellType.EmptyCell:
      return <EmptyCell />;
    case UiCellType.BlankCell:
      return <BlankCell />;
    case UiCellType.DestinyCell:
      return (
        <DestinyCell
          iconUri={item.icon}
          primaryStat={item.primaryStat}
          calculatedWaterMark={item.calculatedWaterMark}
          damageTypeIconUri={item.damageTypeIconUri}
          masterwork={item.masterwork}
          crafted={item.crafted}
          itemHash={item.itemHash}
          itemInstanceId={item.itemInstanceId}
          characterId={item.characterId}
        />
      );
    case UiCellType.EquipSectionCell:
      return <BlankCell />;
  }
};

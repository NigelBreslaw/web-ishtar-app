import type { DestinyIconData } from "@/app/bungie/Common";
import { DEFAULT_MARGIN, ICON_MARGIN, VAULT_5x5_HEIGHT } from "@/app/utilities/UISize.ts";
import DestinyCell from "@/app/inventory/DestinyCell.tsx";
import EmptyCell from "@/app/inventory/EmptyCell.tsx";
import React from "react";
import { StyleSheet, View } from "react-native";

const array25 = Array.from({ length: 25 });

type Vault5x5Props = {
  data: DestinyIconData[];
};

const styles = StyleSheet.create({
  container: {
    marginLeft: DEFAULT_MARGIN,
    marginRight: DEFAULT_MARGIN,
    height: VAULT_5x5_HEIGHT,
    flex: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignContent: "space-between",
  },
});

function Vault5x5UI(props: Vault5x5Props) {
  return (
    <View>
      <View style={styles.container}>
        {array25.map((_v, index) => {
          const item = props.data[index];
          if (item) {
            return (
              // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
              <DestinyCell key={index} data={item} />
            );
          }
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
            <EmptyCell key={index} />
          );
        })}
      </View>
      <View style={{ height: ICON_MARGIN }} />
    </View>
  );
}

export default React.memo(Vault5x5UI);

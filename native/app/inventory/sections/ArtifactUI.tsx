import React from "react";
import { View, StyleSheet } from "react-native";

import ArtifactCell from "@/app/inventory/cells/ArtifactCell.tsx";
import EmptyCell from "@/app/inventory/cells/EmptyCell.tsx";
import { DEFAULT_SECTION_4_WIDTH, ICON_MARGIN, ICON_SIZE } from "@/app/utilities/UISize.ts";
import type { DestinyIconData } from "@/app/inventory/logic/Types.ts";

const styles = StyleSheet.create({
  container: {
    width: DEFAULT_SECTION_4_WIDTH,
    height: ICON_SIZE + ICON_MARGIN,
    alignSelf: "center",
  },
});

type ArtifactProps = {
  readonly equipped: DestinyIconData | null;
};

function ArtifactUI(props: ArtifactProps) {
  return (
    <View style={styles.container}>
      {props.equipped !== null ? <ArtifactCell data={props.equipped} /> : <EmptyCell />}
    </View>
  );
}

export default React.memo(ArtifactUI);

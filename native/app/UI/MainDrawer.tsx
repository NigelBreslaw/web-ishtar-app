import { getFullProfile } from "@/app/bungie/BungieApi.ts";
import InventoryHeader from "@/app/inventory/pages/InventoryHeader.tsx";
import InventoryPages from "@/app/inventory/pages/InventoryPages.tsx";
import { useGGStore } from "@/app/store/GGStore.ts";
import { type DrawerContentComponentProps, createDrawerNavigator, DrawerItem } from "@react-navigation/drawer";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { getGuardianClassType } from "@/app/utilities/Helpers.ts";
import { Image } from "expo-image";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import * as Haptics from "expo-haptics";
import { LOGO_DARK, REFRESH_ICON } from "@/app/inventory/logic/Constants.ts";
import Spinner from "@/app/UI/Spinner.tsx";
import SearchView from "@/app/inventory/pages/SearchView.tsx";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    justifyContent: "space-between",
    padding: 10,
  },
  top: {
    flex: 1,
    justifyContent: "flex-start",
  },
  bottom: {
    flex: 1,
    justifyContent: "flex-end",
  },
  iconButton: {
    width: 40,
    height: 40,
    alignSelf: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: 20,
    height: 20,
    alignSelf: "center",
  },
  spinner: {
    width: 20,
    height: 20,
    alignSelf: "center",
    position: "absolute",
  },
  textDark: {
    color: "#F1EDFE",
    fontSize: 50,
    fontWeight: "bold",
    letterSpacing: -2,
    lineHeight: 48,
  },
  button: {
    width: "100%",
    height: 40,
    borderRadius: 20,
    backgroundColor: "#6750A4",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    flexDirection: "row",
    gap: 4,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    includeFontPadding: false,
  },
});

function RefreshButton() {
  const refreshing = useGGStore((state) => state.refreshing);

  return (
    <TouchableWithoutFeedback onPress={() => getFullProfile()}>
      <View style={styles.iconButton}>
        <Image source={REFRESH_ICON} style={[styles.iconImage, { opacity: refreshing ? 0 : 1 }]} />
        {refreshing && (
          <View style={styles.spinner}>
            <Spinner size={52} />
          </View>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

function CharacterHeaderButtons() {
  const ggCharacters = useGGStore((state) => state.ggCharacters);
  const currentListIndex = useGGStore((state) => state.currentListIndex);
  const scale = 0.4;
  const originalHeight = 96;
  const borderRadius = 7;
  const transferHeight = originalHeight * scale;

  return (
    <View style={{ flexDirection: "row", gap: 10 }}>
      {ggCharacters.map((ggCharacter, index) => {
        return (
          <TouchableOpacity
            onPress={() => useGGStore.getState().setJumpToIndex({ index, animate: true })}
            key={ggCharacter.characterId}
          >
            <View
              style={{
                width: transferHeight,
                height: transferHeight,
                borderRadius,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  transformOrigin: "top left",
                  transform: [{ scale: scale }],
                }}
              >
                <Image source={ggCharacter.emblemPath} style={{ width: 96, height: 96 }} />
              </View>
              <View
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  left: 0,
                  right: 0,
                  borderRadius,
                  borderWidth: 1,
                  borderColor: index === currentListIndex ? "white" : "#5B5B5B",
                }}
              />
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props: DrawerContentComponentProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 4, paddingBottom: insets.bottom + 4 }]}>
      <View style={styles.top}>
        <DrawerItem
          label="Inventory"
          activeTintColor="white"
          inactiveTintColor="grey"
          activeBackgroundColor="#ffffff20"
          focused={props.state.index === 0}
          onPress={() => props.navigation.navigate("Inventory")}
        />
        <DrawerItem
          label="Search"
          activeTintColor="white"
          inactiveTintColor="grey"
          focused={props.state.index === 1}
          activeBackgroundColor="#ffffff20"
          onPress={() => props.navigation.navigate("Search")}
        />
      </View>

      <View style={styles.bottom}>
        <Image source={LOGO_DARK} style={{ width: 100, height: 100 }} />
        <Text style={styles.textDark}>Guardian Ghost</Text>
        <View>
          {__DEV__ && (
            <TouchableOpacity
              onPress={() => {
                useGGStore.getState().clearCache();
              }}
            >
              <View style={styles.button}>
                <Text style={styles.buttonText}>Clear Cache</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              props.navigation.closeDrawer();
              useGGStore.getState().logoutCurrentUser();
            }}
            onPressIn={() => {
              if (Platform.OS !== "web") {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }
            }}
          >
            <View style={styles.button}>
              <Text style={styles.buttonText}>Logout</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function MainDrawer() {
  const ggGuardians = useGGStore((state) => state.ggCharacters);
  const currentListIndex = useGGStore((state) => state.currentListIndex);
  const guardianClassType = getGuardianClassType(ggGuardians[currentListIndex]?.guardianClassType);

  return (
    <Drawer.Navigator
      drawerContent={CustomDrawerContent}
      screenOptions={{
        swipeEdgeWidth: 0,
        drawerType: "front",
      }}
    >
      <Drawer.Screen
        name="Inventory"
        component={InventoryPages}
        options={{
          title: `${guardianClassType}`,

          sceneContainerStyle: {
            backgroundColor: "#17101F",
          },
          headerStyle: {
            backgroundColor: "#17101F",
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: "#2A1D38",
          },
          headerTintColor: "white",
          drawerActiveBackgroundColor: "blue",
          headerRight: RefreshButton,
          headerTitle: CharacterHeaderButtons,
          headerBackground: InventoryHeader,
        }}
      />
      <Drawer.Screen
        name="Search"
        component={SearchView}
        options={{
          headerStyle: {
            backgroundColor: "#17101F",
          },
          headerTintColor: "white",
        }}
      />
    </Drawer.Navigator>
  );
}

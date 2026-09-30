import { View, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types";
import { useMenu } from "../context/MenuContext.tsx";

export const TAB_BAR_HEIGHT = 64;
export type TabKey = "home" | "menu" | "reservation" | "mypage";

type Props = {
    active: TabKey;
    navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>;
};

export default function TabBar({ active, navigationRef }: Props) {
    const { openMenu } = useMenu();
    const tabs: { key: TabKey; icon: string; onPress: () => void }[] = [
        { key: "home", icon: "home", onPress: () => navigationRef.navigate("Home") },
        { key: "menu", icon: "menu", onPress: openMenu },
        { key: "reservation", icon: "check-square", onPress: () => navigationRef.navigate("RoomList") },
        { key: "mypage", icon: "user", onPress: () => {} },
    ];

    return (
        <View style={styles.container}>
            {tabs.map((tab) => (
                <TouchableOpacity key={tab.key} onPress={tab.onPress} style={styles.tab}>
                    <Feather
                        name={tab.icon}
                        size={24}
                        color={active === tab.key ? "#30BD5E" : "#FFF"}
                    />
                </TouchableOpacity>
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 20,
        right: 20,
        bottom: 20,
        height: TAB_BAR_HEIGHT,
        backgroundColor: "#1D1D1D",
        borderRadius: 12,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    tab: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
});
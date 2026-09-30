import { useEffect, useRef } from "react";
import { Animated, Dimensions, Pressable, StyleSheet, Text, View } from "react-native";
import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import { useMenu } from "../context/MenuContext.tsx";
import { fonts } from "../theme";
import type { RootStackParamList } from "../navigation/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MENU_WIDTH = SCREEN_WIDTH * 0.45;

type MenuItem = { label: string; screen?: keyof RootStackParamList };

const MENU_ITEMS: MenuItem[] = [
    { label: "HOME", screen: "Home" },
    { label: "ABOUT", screen: "About" },
    { label: "RESERVATION", screen: "RoomList" },
    { label: "INFO", screen: "Info" },
];

type Props = {
    navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>;
};

export default function Menu({ navigationRef }: Props) {
    const { isMenuOpen, closeMenu } = useMenu();
    const translateX = useRef(new Animated.Value(-MENU_WIDTH)).current;

    useEffect(() => {
        Animated.timing(translateX, {
            toValue: isMenuOpen ? 0 : -MENU_WIDTH,
            duration: 250,
            useNativeDriver: true,
        }).start();
    }, [isMenuOpen, translateX]);

    const handlePress = (item: MenuItem) => {
        if (item.screen) {
            navigationRef.navigate(item.screen as never);
        }
        closeMenu();
    };

    return (
        <View style={styles.overlay} pointerEvents={isMenuOpen ? "auto" : "none"}>
            {isMenuOpen && <Pressable style={styles.backdrop} onPress={closeMenu} />}
            <Animated.View style={[styles.panel, { transform: [{ translateX }] }]}>
                <Text style={styles.logo}>H</Text>
                {MENU_ITEMS.map((item) => (
                    <Text key={item.label} style={styles.item} onPress={() => handlePress(item)}>
                        {item.label}
                    </Text>
                ))}
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    overlay: { ...StyleSheet.absoluteFill },
    backdrop: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    panel: {
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        width: MENU_WIDTH,
        backgroundColor: "#1D1D1D",
        alignItems: "center",
        paddingTop: 60,
    },
    logo: {
        color: "#FFFFFF",
        fontSize: 30,
        fontFamily: fonts.bold,
        marginBottom: 40,
    },
    item: {
        color: "#FFFFFF",
        fontSize: 17,
        fontFamily: fonts.bold,
        marginBottom: 28,
    },
});
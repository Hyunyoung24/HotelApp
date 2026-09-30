import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useMenu } from "../context/MenuContext.tsx";
import { fonts } from "../theme";

export const HEADER_HEIGHT = 55;

export default function Header() {
    const { openMenu } = useMenu();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top, height: HEADER_HEIGHT + insets.top }]}>
            <TouchableOpacity onPress={openMenu} style={styles.iconButton}>
                <Feather name="grid" size={22} color="#000000" />
            </TouchableOpacity>
            <Text style={styles.logo}>H</Text>
            <View style={styles.iconButton} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        backgroundColor: "#FFF",
    },
    iconButton: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    logo: {
        fontSize: 32,
        lineHeight: 32,
        fontFamily: fonts.bold,
        color: "#1D1D1D",
    },
});
import { useEffect } from "react";
import { Text, View, Image, StyleSheet } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/types";
import { fonts } from "../theme";

type Props = StackScreenProps<RootStackParamList, "Splash">;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
    },
    imageWrapper: {
        width: "100%",
        height: "100%",
    },
    background: {
        width: "100%",
        height: "100%",
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.35)",
    },
    logo: {
        ...StyleSheet.absoluteFill,
        textAlign: "center",
        textAlignVertical: "center",
        fontSize: 40,
        fontFamily: fonts.bold,
        color: "#FFFFFF",
    },
});

export default function Splash({ navigation }: Props) {
    useEffect(() => {
        const timer = setTimeout(() => {
            navigation.replace("Home");
        }, 2000);

        return () => clearTimeout(timer);
    }, [navigation]);

    return (
        <View style={styles.imageWrapper}>
            <Image
                style={styles.background}
                source={require("../assets/images/splash.jpg")}
                resizeMode="cover"
            />
            <View style={styles.overlay} />
            <Text style={styles.logo}>H</Text>
        </View>
    );
}
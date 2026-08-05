import { useEffect } from "react";
import { Text, View, StatusBar, Image, StyleSheet } from "react-native";
import type { StackScreenProps } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/types";

type Props = StackScreenProps<RootStackParamList, "Splash">;

const styles = StyleSheet.create({
    container: {
        flex: 1 
    }, 
    background: {
        ...StyleSheet.absoluteFill
    }, 
    logo: {
        flex: 1,
        textAlign: "center", 
        textAlignVertical: "center", 
        fontSize: 40, 
        fontWeight: "bold", 
        color: "#ffffff", 
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
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Image 
                style={styles.background} 
                source={require("../assets/images/splash.jpg")}
            />
            <Text style={styles.logo}>H</Text>
        </View>
    );
}
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
    liked: boolean;
    onToggleLike: () => void;
};

export default function ReservationHeader({ liked, onToggleLike }: Props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { top: insets.top + 12 }]}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.button}>
                <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
            <TouchableOpacity onPress={onToggleLike} style={styles.button}>
                <Ionicons
                    name={liked ? "heart" : "heart-outline"}
                    size={20}
                    color={liked ? "#FF0000" : "#FFFFFF"}
                />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 20,
        right: 20,
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        width: 36,
        height: 36,
        borderRadius: 6,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        alignItems: "center",
        justifyContent: "center",
    },
});

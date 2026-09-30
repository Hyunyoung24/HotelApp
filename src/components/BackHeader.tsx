import { View, Text, Pressable, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { HEADER_HEIGHT } from "./Header";
import { fonts } from "../theme";

// 메인 헤더(Header)와 동일한 높이 - 뒤로가기/타이틀만 다르게 낀 버전
export const BACK_HEADER_HEIGHT = HEADER_HEIGHT;

type Props = { title: string };

// 예약 플로우(Schedule) 전용 헤더 - 뒤로가기 + 가운데 타이틀
export default function BackHeader({ title }: Props) {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { paddingTop: insets.top, height: BACK_HEADER_HEIGHT + insets.top }]}>
            <Pressable onPress={() => navigation.goBack()} style={styles.iconButton}>
                <Feather name="arrow-left" size={22} color="#000000" />
            </Pressable>
            <Text style={styles.title}>{title}</Text>
            <View style={styles.iconButton} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "flex-start",
        justifyContent: "space-between",
        paddingHorizontal: 20,
        backgroundColor: "#FFFFFF",
    },
    iconButton: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 20,
        lineHeight: 32,
        fontFamily: fonts.bold,
        color: "#000000",
    },
});

import { Dimensions, Image, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NavigationProp } from "@react-navigation/native";
import TabBarScreen from "../components/TabBarScreen";
import { useRooms } from "../hooks";
import { ROOM_IMAGES, fonts } from "../theme";
import type { RootStackParamList } from "../navigation/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_MARGIN = 25;
const CARD_WIDTH = SCREEN_WIDTH - CARD_MARGIN * 2;
const CARD_HEIGHT = CARD_WIDTH * (145.5 / 310);

export default function RoomList() {
    const { rooms, loading } = useRooms();
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();

    if (loading) {
        return <TabBarScreen>{null}</TabBarScreen>;
    }

    return (
        <TabBarScreen>
            {rooms.map((room) => (
                <TouchableOpacity
                    key={room.id}
                    style={styles.card}
                    activeOpacity={0.85}
                    onPress={() => navigation.navigate("RoomDetail", { roomId: Number(room.id) })}
                >
                    <Image source={ROOM_IMAGES[room.name_eng]} style={styles.image} />
                    <View style={styles.overlay} />
                    <Text style={styles.name}>{room.name_eng.toUpperCase()}</Text>
                </TouchableOpacity>
            ))}
        </TabBarScreen>
    );
}

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        marginHorizontal: CARD_MARGIN,
        marginBottom: 14,
        borderRadius: 12,
        overflow: "hidden",
    },
    image: {
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
    },
    overlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.25)",
    },
    name: {
        position: "absolute",
        alignSelf: "center",
        top: "42%",
        fontSize: 22,
        fontFamily: fonts.bold,
        color: "#FFFFFF",
    },
});

import { Dimensions, FlatList, Image, Text, View, StyleSheet } from "react-native";
import { fonts } from "../theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_IMAGE_SIZE = SCREEN_WIDTH * 0.4;

type Event = {
    id: string;
    title: string;
    image: ReturnType<typeof require>;
};

const EVENTS: Event[] = [
    { id: "1", title: "봄 특가 이벤트", image: require("../assets/images/event1.jpg") },
    { id: "2", title: "6월 주요행사", image: require("../assets/images/event2.jpg") },
    { id: "3", title: "여름 프로모션", image: require("../assets/images/event3.jpg") },
];

export default function EventSection() {
    return (
        <View style={styles.section}>
            <Text style={styles.title}>EVENT</Text>
            <FlatList
                data={EVENTS}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
                renderItem={({ item }) => (
                    <View style={styles.card}>
                        <Image source={item.image} style={styles.image} />
                        <Text style={styles.name}>{item.title}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    section: {
        marginTop: 24,
    },
    title: {
        fontSize: 22,
        fontFamily: fonts.bold,
        color: "#000000",
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    list: {
        paddingHorizontal: 20,
        gap: 20,
    },
    card: {
        width: CARD_IMAGE_SIZE,
    },
    image: {
        width: CARD_IMAGE_SIZE,
        height: CARD_IMAGE_SIZE,
        borderRadius: 12,
        marginBottom: 8,
    },
    name: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: "#000000",
        marginTop: 2,
        marginBottom: 10,
    },
});

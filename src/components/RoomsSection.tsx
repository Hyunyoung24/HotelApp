import { Dimensions, FlatList, Image, Text, View, StyleSheet } from "react-native";
import { useRooms, usePrices } from "../hooks";
import { ROOM_IMAGES, fonts } from "../theme";
import type { Room, Price } from "../api";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CARD_IMAGE_SIZE = SCREEN_WIDTH * 0.4;

function getBasePrice(prices: Price[], roomId: number) {
    return prices.find((p) => Number(p.room_id) === Number(roomId) && p.season_id === 1)?.weekday_price;
}

export default function RoomsSection() {
    const { rooms, loading: roomsLoading } = useRooms();
    const { prices, loading: pricesLoading, error: pricesError } = usePrices();

    if (pricesError) {
        console.error("가격 정보를 불러오지 못했어요:", pricesError);
    }

    if (roomsLoading || pricesLoading) {
        return null;
    }

    return (
        <View style={styles.section}>
            <Text style={styles.title}>ROOMS</Text>
            <FlatList
                data={rooms}
                keyExtractor={(item) => String(item.id)}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.list}
                renderItem={({ item }: { item: Room }) => {
                    const price = getBasePrice(prices, item.id);
                    return (
                        <View style={styles.card}>
                            <Image source={ROOM_IMAGES[item.name_eng]} style={styles.image} />
                            <Text style={styles.name}>{item.name_eng.toUpperCase()}</Text>
                            {price !== undefined && (
                                <Text style={styles.price}>{price.toLocaleString()} / 주중</Text>
                            )}
                        </View>
                    );
                }}
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
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    list: {
        paddingHorizontal: 20,
        marginBottom: 20, 
        gap: 20,
    },
    card: {
        width: CARD_IMAGE_SIZE,
    },
    image: {
        width: CARD_IMAGE_SIZE,
        height: CARD_IMAGE_SIZE,
        borderRadius: 12,
    },
    name: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: "#000000",
        marginTop: 10, 
        marginBottom: 10,
    },
    price: {
        fontSize: 18,
        fontFamily: fonts.medium,
        color: "#000000",
    },
});

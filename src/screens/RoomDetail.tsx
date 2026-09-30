import { useMemo, useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
    StyleSheet,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NavigationProp, RouteProp } from "@react-navigation/native";
import BottomActionBar, { BOTTOM_ACTION_BAR_CLEARANCE } from "../components/BottomActionBar";
import ReservationHeader from "../components/ReservationHeader";
import { useRooms, usePrices, useSeasons } from "../hooks";
import { toggleRoomLike } from "../api";
import { ROOM_GALLERY_IMAGES, fonts } from "../theme";
import type { RootStackParamList } from "../navigation/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HERO_HEIGHT = SCREEN_WIDTH * 1.1;
const THUMBNAIL_SIZE = SCREEN_WIDTH * 0.219;

function formatMonthDay(date: string) {
    return date.slice(5).replace("-", ".");
}

export default function RoomDetail() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "RoomDetail">>();
    const { roomId } = route.params;

    const { rooms } = useRooms();
    const { prices } = usePrices();
    const { seasons } = useSeasons();

    const room = useMemo(() => rooms.find((r) => Number(r.id) === Number(roomId)), [rooms, roomId]);

    const [selectedImage, setSelectedImage] = useState(0);
    const [isLiked, setIsLiked] = useState<boolean | null>(null);

    const liked = isLiked ?? room?.is_liked ?? false;

    const handleToggleLike = () => {
        if (!room) return;
        const next = !liked;
        setIsLiked(next);
        toggleRoomLike(Number(room.id), next).catch(() => {
            setIsLiked(!next);
        });
    };

    if (!room) {
        return <View style={styles.flex} />;
    }

    const galleryImages = room.images.map((filename) => ROOM_GALLERY_IMAGES[filename]).filter(Boolean);
    const heroImage = galleryImages[selectedImage] ?? galleryImages[0];

    return (
        <View style={styles.flex}>
            <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
                <View style={styles.heroWrapper}>
                    <Image source={heroImage} style={styles.heroImage} resizeMode="cover" />
                </View>

                <View style={styles.sheet}>
                    <View style={styles.titleRow}>
                        <Text style={styles.title}>{room.name_eng.toUpperCase()}</Text>
                        <Text style={styles.titleArea}>{room.area}㎡</Text>
                    </View>

                    {galleryImages.length > 1 && (
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.thumbnailList}
                        >
                            {galleryImages.map((image, index) => (
                                <TouchableOpacity key={index} onPress={() => setSelectedImage(index)}>
                                    <Image
                                        source={image}
                                        style={[
                                            styles.thumbnail,
                                            index === selectedImage && styles.thumbnailActive,
                                        ]}
                                    />
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    )}

                    <View style={styles.infoRow}>
                        <View style={styles.infoColumn}>
                            <Text style={styles.sectionLabel}>Area</Text>
                            <Text style={styles.infoValue}>{room.area}㎡</Text>
                        </View>
                        <View style={styles.infoColumn}>
                            <Text style={styles.sectionLabel}>Capacity</Text>
                            <Text style={styles.infoValue}>
                                기준 {room.min}명 / 최대 {room.capacity}명 ({room.min}/{room.capacity})
                            </Text>
                        </View>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Details</Text>
                        <Text style={styles.desc}>{room.desc}</Text>
                        <Text style={styles.descEng}>{room.desc_eng}</Text>
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Price</Text>
                        {seasons.map((season) => {
                            const price = prices.find(
                                (p) =>
                                    Number(p.room_id) === Number(room.id) &&
                                    Number(p.season_id) === Number(season.id),
                            );
                            if (!price) return null;
                            return (
                                <View key={season.id} style={styles.priceBlock}>
                                    <Text style={styles.priceHeaderText}>
                                        {season.name}{" "}
                                        <Text style={styles.priceHeaderTextDate}>
                                            ({formatMonthDay(season.start_date)}-
                                            {formatMonthDay(season.end_date)})
                                        </Text>
                                    </Text>
                                    <Text style={styles.priceRowText}>
                                        {price.weekday_price.toLocaleString()} / 주중
                                    </Text>
                                    <Text style={styles.priceRowText}>
                                        {price.weekend_price.toLocaleString()} / 주말
                                    </Text>
                                    <Text style={styles.priceRowText}>
                                        {price.holiday_price.toLocaleString()} / 휴일
                                    </Text>
                                </View>
                            );
                        })}
                    </View>

                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Policy</Text>
                        <Text style={styles.policyTitle}>취소 및 환불 규정</Text>
                        <Text style={styles.policyText}>
                            숙박 예정일 1일 전 18시까지는 위약금 없이 취소 및 변경이 가능합니다.
                        </Text>
                        <Text style={styles.lineBreak}>{"\n"}</Text>
                        <Text style={styles.policyText}>
                            숙박 예정일 1일 전 18시 이후 취소/변경 및 노쇼(No-show) 발생 시,
                        </Text>
                        <Text style={styles.policyText}>
                            - 성수기 : 최초 1일 숙박 요금의 80%가 위약금으로 부과됩니다.
                        </Text>
                        <Text style={styles.policyText}>
                            - 비수기(성수기 외 기간) : 최초 1일 숙박 요금의 10%가 위약금으로 부과됩니다.
                        </Text>
                        <Text style={styles.lineBreak}>{"\n"}</Text>
                        <Text style={styles.policyText}>
                            일부 패키지의 경우 별도의 취소규정이 적용됩니다.
                        </Text>
                    </View>
                </View>
            </ScrollView>

            <ReservationHeader liked={liked} onToggleLike={handleToggleLike} />

            <BottomActionBar
                label={room.name_eng.toUpperCase()}
                onPress={() => navigation.navigate("ReservationDate", { roomId: Number(room.id) })}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: "#FFFFFF" },
    heroWrapper: {
        width: SCREEN_WIDTH,
        height: HERO_HEIGHT,
        backgroundColor: "#EEEEEE",
    },
    heroImage: {
        width: "100%",
        height: "100%",
    },
    sheet: {
        marginTop: -20,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        backgroundColor: "#FFFFFF",
        paddingHorizontal: 20,
        paddingTop: 24,
        paddingBottom: BOTTOM_ACTION_BAR_CLEARANCE,
    },
    titleRow: {
        flexDirection: "row",
        alignItems: "flex-end",
        marginBottom: 16,
    },
    title: {
        fontSize: 22,
        fontFamily: fonts.bold,
        color: "#000000",
    },
    titleArea: {
        fontSize: 15,
        fontFamily: fonts.medium,
        color: "#999999",
        marginLeft: 8,
        marginBottom: 4,
    },
    thumbnailList: {
        gap: 16,
        marginBottom: 24,
    },
    thumbnail: {
        width: THUMBNAIL_SIZE,
        height: THUMBNAIL_SIZE,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: "transparent",
    },
    thumbnailActive: {
        borderColor: "#30BD5E",
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 24,
    },
    infoColumn: {
        flex: 1,
    },
    sectionLabel: {
        fontSize: 17,
        fontFamily: fonts.bold,
        color: "#000000",
        marginBottom: 12,
    },
    infoValue: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: "#000000",
    },
    section: {
        marginBottom: 24,
    },
    desc: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: "#000000",
        lineHeight: 24,
        marginBottom: 10,
    },
    descEng: {
        fontSize: 16.5,
        fontFamily: fonts.medium,
        color: "#818181",
        lineHeight: 24,
        marginBottom: 12, 
    },
    priceBlock: {
        paddingBottom: 10,
        fontFamily: fonts.medium,
    },
    priceHeaderTextDate: {
        color: "#818181",
        fontFamily: fonts.medium, 
    }, 
    priceHeaderText: {
        fontSize: 17,
        fontFamily: fonts.medium,
        color: "#000000",
        backgroundColor: "#EFEFEF",
        paddingHorizontal: 20, 
        paddingTop: 10,
        paddingBottom: 10,
        marginHorizontal: -20,   
        marginBottom: 12,
    },
    priceRowText: {
        fontSize: 17,
        fontFamily: fonts.medium,
        color: "#333333",
        marginBottom: 10,
        lineHeight: 22, 
    },
    policyTitle: {
        fontSize: 17,
        fontFamily: fonts.medium,
        color: "#000000",
        backgroundColor: "#EFEFEF",
        paddingHorizontal: 20, 
        paddingTop: 10,
        paddingBottom: 10,
        marginHorizontal: -20,
        marginTop: 6,    
        marginBottom: 12,
    },
    policyText: {
        fontSize: 17,
        fontFamily: fonts.medium,
        color: "#444444",
        lineHeight: 24,
        marginBottom: 14,
    },
    lineBreak: {
        marginVertical: -13, 
    }
});

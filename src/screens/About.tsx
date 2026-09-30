import { Dimensions, Image, ScrollView, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fonts } from "../theme";

const SCREEN_WIDTH = Dimensions.get("window").width;
const HERO_HEIGHT = SCREEN_WIDTH * 0.75;
const HERO_ASPECT_RATIO = 740 / 1110; // slide1.jpg 원본 비율
const HERO_IMAGE_HEIGHT = SCREEN_WIDTH / HERO_ASPECT_RATIO;
const HERO_OVERFLOW = HERO_IMAGE_HEIGHT - HERO_HEIGHT;
// 0~1 사이 값만 유효함 (0 = 위쪽 기준, 1 = 아래쪽 기준)
const HERO_FOCAL_RATIO = 0.75;
const HERO_TOP_OFFSET = -HERO_OVERFLOW * HERO_FOCAL_RATIO;

type Amenity = { icon: string; label: string };

const AMENITIES: Amenity[] = [
    { icon: "wifi", label: "무료 Wi-Fi" },
    { icon: "coffee", label: "조식 레스토랑" },
    { icon: "droplet", label: "실내 수영장" },
    { icon: "truck", label: "무료 주차" },
    { icon: "activity", label: "피트니스 센터" },
    { icon: "wind", label: "스파 & 사우나" },
];

export default function About() {
    const navigation = useNavigation();
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.flex}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                <View style={styles.heroWrapper}>
                    <Image source={require("../assets/images/slide1.jpg")} style={styles.hero} />
                </View>

                <View style={styles.section}>
                    <Text style={styles.brand}>HOTEL H</Text>
                    <Text style={styles.tagline}>도심 속에서 만나는 조용한 휴식</Text>
                    <Text style={styles.body}>
                        HOTEL H는 바쁜 일상에서 벗어나 온전한 휴식을 찾는 분들을 위한 공간입니다.
                        군더더기 없는 인테리어와 세심하게 준비한 서비스로, 머무는 동안만큼은
                        오롯이 편안함에 집중할 수 있도록 노력합니다.
                    </Text>
                    <Text style={styles.body}>
                        스탠다드부터 스윗룸까지, 각기 다른 분위기의 객실이 각자의 방식으로
                        편안한 하룻밤을 준비하고 있습니다.
                    </Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>Amenities</Text>
                    <View style={styles.amenityGrid}>
                        {AMENITIES.map((item) => (
                            <View key={item.label} style={styles.amenityItem}>
                                <View style={styles.amenityIconWrap}>
                                    <Feather name={item.icon} size={20} color="#1D1D1D" />
                                </View>
                                <Text style={styles.amenityLabel}>{item.label}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.section}>
                    <Text style={styles.sectionLabel}>오시는 길</Text>
                    <View style={styles.infoRow}>
                        <Feather name="map-pin" size={16} color="#818181" style={styles.infoIcon} />
                        <Text style={styles.infoText}>서울특별시 강남구 테헤란로 123</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Feather name="phone" size={16} color="#818181" style={styles.infoIcon} />
                        <Text style={styles.infoText}>02-1234-5678</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Feather name="mail" size={16} color="#818181" style={styles.infoIcon} />
                        <Text style={styles.infoText}>contact@hotelh.com</Text>
                    </View>
                </View>
            </ScrollView>

            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={[styles.backButton, { top: insets.top + 12 }]}
            >
                <Feather name="arrow-left" size={20} color="#FFFFFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: "#FFFFFF" },
    content: { paddingBottom: 60 },
    heroWrapper: {
        width: SCREEN_WIDTH,
        height: HERO_HEIGHT,
        overflow: "hidden",
        backgroundColor: "#EEEEEE",
    },
    hero: {
        width: "100%",
        height: HERO_IMAGE_HEIGHT,
        position: "absolute",
        top: HERO_TOP_OFFSET,
    },
    backButton: {
        position: "absolute",
        left: 20,
        width: 36,
        height: 36,
        borderRadius: 6,
        backgroundColor: "rgba(0, 0, 0, 0.25)",
        alignItems: "center",
        justifyContent: "center",
    },
    section: {
        paddingHorizontal: 20,
        paddingTop: 24,
    },
    brand: {
        fontSize: 24,
        fontFamily: fonts.bold,
        color: "#000000",
        marginBottom: 6,
    },
    tagline: {
        fontSize: 15,
        fontFamily: fonts.medium,
        color: "#818181",
        marginBottom: 18,
    },
    body: {
        fontSize: 15,
        fontFamily: fonts.medium,
        color: "#333333",
        lineHeight: 23,
        marginBottom: 14,
    },
    divider: {
        height: 1,
        backgroundColor: "#EFEFEF",
        marginTop: 8,
        marginHorizontal: 20,
    },
    sectionLabel: {
        fontSize: 17,
        fontFamily: fonts.bold,
        color: "#000000",
        marginBottom: 16,
    },
    amenityGrid: {
        flexDirection: "row",
        flexWrap: "wrap",
    },
    amenityItem: {
        width: "33.33%",
        alignItems: "center",
        marginBottom: 20,
    },
    amenityIconWrap: {
        width: 52,
        height: 52,
        borderRadius: 26,
        backgroundColor: "#F5F5F5",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    amenityLabel: {
        fontSize: 12.5,
        fontFamily: fonts.medium,
        color: "#333333",
        textAlign: "center",
    },
    infoRow: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 12,
    },
    infoIcon: {
        width: 20,
    },
    infoText: {
        fontSize: 15,
        fontFamily: fonts.medium,
        color: "#333333",
        marginLeft: 8,
    },
});

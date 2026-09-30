import { useEffect, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    FlatList,
    Image,
    StyleSheet,
    Text,
    View,
    type NativeScrollEvent,
    type NativeSyntheticEvent,
} from "react-native";
import { fonts } from "../theme";

const DOT_FADE_DURATION = 150;

const SCREEN_WIDTH = Dimensions.get("window").width;
const BANNER_MARGIN = 20;
const BANNER_SIZE = SCREEN_WIDTH - BANNER_MARGIN * 2;
const AUTO_SLIDE_INTERVAL = 3000;
const SLIDE1_ASPECT_RATIO = 740 / 1110;
// 0~1 사이 값만 유효함 (0 = 위쪽 기준, 1 = 아래쪽 기준)
const SLIDE1_FOCAL_RATIO = 3.25;
const SLIDE1_IMAGE_HEIGHT = BANNER_SIZE / SLIDE1_ASPECT_RATIO;
const SLIDE1_OVERFLOW = SLIDE1_IMAGE_HEIGHT - BANNER_SIZE;
const SLIDE1_TOP_OFFSET = -SLIDE1_OVERFLOW * SLIDE1_FOCAL_RATIO;

type Slide = {
    id: string;
    image: ReturnType<typeof require>;
    title: string;
    align?: "bottom";
};

const SLIDES: Slide[] = [
    { id: "1", image: require("../assets/images/slide1.jpg"), title: "SWEET\nMOMENT", align: "bottom" },
    { id: "2", image: require("../assets/images/slide2.jpg"), title: "URBAN\nRESORT" },
    { id: "3", image: require("../assets/images/slide3.jpg"), title: "RELAX & RELIFE" },
];

export default function BannerCarousel() {
    const [activeIndex, setActiveIndex] = useState(0);
    const listRef = useRef<FlatList<Slide>>(null);
    const indexRef = useRef(0);
    const prevIndexRef = useRef(0);
    const dotAnimations = useRef(SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0))).current;

    const goToIndex = (nextIndex: number) => {
        const prevIndex = indexRef.current;
        indexRef.current = nextIndex;
        prevIndexRef.current = prevIndex;
        setActiveIndex(nextIndex);
    };

    useEffect(() => {
        const timer = setInterval(() => {
            const nextIndex = indexRef.current + 1 >= SLIDES.length ? 0 : indexRef.current + 1;
            listRef.current?.scrollToIndex({ index: nextIndex, animated: true });
            goToIndex(nextIndex);
        }, AUTO_SLIDE_INTERVAL);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        // 새로 활성화된 점은 바로 꽉 채움
        dotAnimations[activeIndex].setValue(1);

        // 이전에 활성화됐던 점은 부드럽게 비움
        const prevIndex = prevIndexRef.current;
        if (prevIndex !== activeIndex) {
            Animated.timing(dotAnimations[prevIndex], {
                toValue: 0,
                duration: DOT_FADE_DURATION,
                useNativeDriver: true,
            }).start();
        }
    }, [activeIndex, dotAnimations]);

    const handleMomentumScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / BANNER_SIZE);
        goToIndex(index);
    };

    return (
        <View style={styles.wrapper}>
            <FlatList
                ref={listRef}
                data={SLIDES}
                keyExtractor={(item) => item.id}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                snapToInterval={BANNER_SIZE}
                decelerationRate="fast"
                onMomentumScrollEnd={handleMomentumScrollEnd}
                getItemLayout={(_, index) => ({
                    length: BANNER_SIZE,
                    offset: BANNER_SIZE * index,
                    index,
                })}
                renderItem={({ item }) => (
                    <View style={styles.slide}>
                        {item.align === "bottom" ? (
                            <Image
                                source={item.image}
                                style={[styles.bottomAlignedImage, { aspectRatio: SLIDE1_ASPECT_RATIO }]}
                            />
                        ) : (
                            <Image source={item.image} style={styles.fillImage} resizeMode="cover" />
                        )}
                        <View style={styles.darkOverlay} />
                        <Text style={styles.slideTitle}>{item.title}</Text>
                    </View>
                )}
            />
            <View style={styles.dots}>
                {SLIDES.map((slide, index) => (
                    <View key={slide.id} style={styles.dot}>
                        <Animated.View style={[styles.dotFill, { opacity: dotAnimations[index] }]} />
                    </View>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        marginTop: 16,
        marginHorizontal: BANNER_MARGIN,
        width: BANNER_SIZE,
        height: BANNER_SIZE,
        borderRadius: 12,
        overflow: "hidden",
    },
    slide: {
        width: BANNER_SIZE,
        height: BANNER_SIZE,
        backgroundColor: "#EEEEEE",
    },
    fillImage: {
        width: "100%",
        height: "100%",
    },
    bottomAlignedImage: {
        width: "100%",
        position: "absolute",
        top: SLIDE1_TOP_OFFSET,
    },
    darkOverlay: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0,0,0,0.3)",
    },
    slideTitle: {
        position: "absolute",
        alignSelf: "center",
        top: "42%",
        textAlign: "center",
        fontSize: 36,
        fontFamily: fonts.bold,
        color: "#FFFFFF",
    },
    dots: {
        position: "absolute",
        bottom: 20,
        left: 0,
        right: 0,
        flexDirection: "row",
        justifyContent: "center",
        gap: 14,
    },
    dot: {
        width: 9,
        height: 9,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: "#FFFFFF",
        alignItems: "center",
        justifyContent: "center",
    },
    dotFill: {
        width: 9,
        height: 9,
        borderRadius: 4,
        backgroundColor: "#FFFFFF",
    },
});

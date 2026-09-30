import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { TAB_BAR_HEIGHT } from "./TabBar";
import { fonts } from "../theme";

const ACTIVE_GREEN = "#30BD5E";
const BOTTOM_MARGIN = 20;

// 바가 화면 바닥에서 차지하는 실제 공간(높이 + 바닥 여백) - 스크롤 콘텐츠 paddingBottom 계산에 사용
export const BOTTOM_ACTION_BAR_CLEARANCE = TAB_BAR_HEIGHT + BOTTOM_MARGIN;

type Props = {
    label: string;
    buttonLabel?: string;
    disabled?: boolean;
    onPress: () => void;
    bottomOffset?: number;
};

// 예약 플로우 하단 고정 바 - 왼쪽 객실명, 오른쪽 액션 버튼
// bottomOffset: 키보드가 떠 있을 때 그 높이만큼 위로 밀어 올리기 위한 값
export default function BottomActionBar({
    label,
    buttonLabel = "예약하기",
    disabled,
    onPress,
    bottomOffset = 0,
}: Props) {
    return (
        <View style={[styles.container, { bottom: BOTTOM_MARGIN + bottomOffset }]}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={[styles.button, disabled && styles.buttonDisabled]}
                onPress={onPress}
                disabled={disabled}
            >
                <Text style={[styles.buttonText, disabled && styles.buttonTextDisabled]}>{buttonLabel}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        position: "absolute",
        left: 20,
        right: 20,
        bottom: BOTTOM_MARGIN,
        height: TAB_BAR_HEIGHT,
        borderRadius: 12,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 30,
        backgroundColor: "#1D1D1D",
        elevation: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
    },
    label: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: "#FFFFFF",
    },
    button: {
        backgroundColor: ACTIVE_GREEN,
        borderRadius: 6,
        paddingHorizontal: 40,
        paddingVertical: 10,
    },
    buttonDisabled: {
        backgroundColor: "#C7C7C7",
    },
    buttonText: {
        fontSize: 16,
        fontFamily: fonts.bold,
        color: "#FFFFFF",
    },
    buttonTextDisabled: {
        color: "#8A8A8A",
    },
});

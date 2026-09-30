import { Modal, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { fonts } from "../theme";

type Props = {
    visible: boolean;
    message: string;
    buttonLabel?: string;
    onConfirm: () => void;
};

// 메시지 + 확인 버튼만 있는 공용 모달 (예약 완료, 경고 등)
export default function MessageModal({ visible, message, buttonLabel = "확인", onConfirm }: Props) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.backdrop}>
                <View style={styles.card}>
                    <Text style={styles.message}>{message}</Text>
                    <TouchableOpacity style={styles.button} onPress={onConfirm}>
                        <Text style={styles.buttonText}>{buttonLabel}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        width: "78%",
        backgroundColor: "#FFF",
        borderRadius: 12,
        paddingVertical: 32,
        paddingHorizontal: 24,
        alignItems: "center",
    },
    message: {
        fontSize: 18,
        fontFamily: fonts.medium,
        color: "#000000",
        marginBottom: 24,
        textAlign: "center",
    },
    button: {
        backgroundColor: "#30BD5E",
        borderRadius: 8,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    buttonText: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: "#FFF",
    },
});

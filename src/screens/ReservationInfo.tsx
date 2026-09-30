import { useEffect, useMemo, useState } from "react";
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    StyleSheet,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { useNavigation, useRoute } from "@react-navigation/native";
import type { NavigationProp, RouteProp } from "@react-navigation/native";
import BackHeader from "../components/BackHeader";
import BottomActionBar, { BOTTOM_ACTION_BAR_CLEARANCE } from "../components/BottomActionBar";
import MessageModal from "../components/MessageModal";
import { useRooms } from "../hooks";
import { createReservation } from "../api";
import { fonts } from "../theme";
import type { RootStackParamList } from "../navigation/types";

const PHONE_REGEX = /^\d{10,11}$/;
const KEYBOARD_GAP = 20; // 키보드 위 여백

function formatDateDisplay(date: string) {
    return date.replaceAll("-", ".");
}

export default function ReservationInfo() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "ReservationInfo">>();
    const { roomId, checkIn, checkOut, guests, totalPrice } = route.params;

    const { rooms } = useRooms();
    const room = useMemo(() => rooms.find((r) => Number(r.id) === Number(roomId)), [rooms, roomId]);
    const roomName = room?.name_eng.toUpperCase() ?? "";

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [nameTouched, setNameTouched] = useState(false);
    const [phoneTouched, setPhoneTouched] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);
    const [keyboardOffset, setKeyboardOffset] = useState(0);

    // 키보드가 뜰 때 하단 액션바가 가려지지 않도록 키보드 높이만큼 띄워줌
    useEffect(() => {
        const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
        const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
        const showSub = Keyboard.addListener(showEvent, (e) => setKeyboardOffset(e.endCoordinates.height + KEYBOARD_GAP));
        const hideSub = Keyboard.addListener(hideEvent, () => setKeyboardOffset(0));
        return () => {
            showSub.remove();
            hideSub.remove();
        };
    }, []);

    const nameValid = name.trim().length > 0;
    const phoneValid = PHONE_REGEX.test(phone);
    const formValid = nameValid && phoneValid;

    const handlePhoneChange = (text: string) => {
        setPhone(text.replace(/[^0-9]/g, ""));
    };

    const handleSubmit = async () => {
        if (!formValid || submitting) return;
        setSubmitting(true);
        setSubmitError(null);
        try {
            await createReservation({
                customer_name: name.trim(),
                phone_number: phone,
                room_id: Number(roomId),
                check_in_date: checkIn,
                check_out_date: checkOut,
                number_of_guests: guests,
                total_price: totalPrice,
            });
            setShowConfirm(true);
        } catch (err) {
            setSubmitError(err instanceof Error ? err.message : "예약에 실패했습니다. 다시 시도해 주세요.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleConfirmClose = () => {
        setShowConfirm(false);
        navigation.reset({ index: 0, routes: [{ name: "Home" }] });
    };

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <BackHeader title="Schedule" />
            <ScrollView
                contentContainerStyle={styles.content}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.sectionLabel}>
                    <Text style={styles.sectionLabelText}>예약자 정보</Text>
                </View>

                <View style={styles.dateRow}>
                    <View style={styles.dateColumn}>
                        <Text style={styles.fieldLabel}>입실</Text>
                        <Text style={styles.dateValue}>{formatDateDisplay(checkIn)}</Text>
                    </View>
                    <View style={styles.dateColumn}>
                        <Text style={styles.fieldLabel}>퇴실</Text>
                        <Text style={styles.dateValue}>{formatDateDisplay(checkOut)}</Text>
                    </View>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={styles.fieldLabel}>인원 추가</Text>
                    <Text style={styles.summaryValue}>{guests > 0 ? `${guests}명` : "추가없음"}</Text>
                </View>

                <View style={styles.inputRow}>
                    <View style={styles.inputLine}>
                        <Text style={styles.inputLabel}>이름</Text>
                        <View style={styles.inputColumn}>
                            <View style={[styles.inputWrapper, nameTouched && !nameValid && styles.inputWrapperError]}>
                                <TextInput
                                    style={styles.input}
                                    value={name}
                                    onChangeText={setName}
                                    onBlur={() => setNameTouched(true)}
                                    placeholder="이름을 입력해 주세요."
                                    placeholderTextColor="#B0B0B0"
                                />
                                <TouchableOpacity onPress={() => setName("")} style={styles.clearButton}>
                                    <Feather name="x" size={14} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                            {nameTouched && !nameValid && (
                                <Text style={styles.errorText}>필수 입력 값입니다.</Text>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.inputRow}>
                    <View style={styles.inputLine}>
                        <Text style={styles.inputLabel}>연락처</Text>
                        <View style={styles.inputColumn}>
                            <View
                                style={[
                                    styles.inputWrapper,
                                    phoneTouched && (phone.length === 0 || !phoneValid) && styles.inputWrapperError,
                                ]}
                            >
                                <TextInput
                                    style={styles.input}
                                    value={phone}
                                    onChangeText={handlePhoneChange}
                                    onBlur={() => setPhoneTouched(true)}
                                    placeholder="-제외 숫자만 입력해 주세요."
                                    placeholderTextColor="#B0B0B0"
                                    keyboardType="number-pad"
                                    maxLength={11}
                                />
                                <TouchableOpacity onPress={() => setPhone("")} style={styles.clearButton}>
                                    <Feather name="x" size={14} color="#FFFFFF" />
                                </TouchableOpacity>
                            </View>
                            {phoneTouched && phone.length === 0 && (
                                <Text style={styles.errorText}>필수 입력 값입니다.</Text>
                            )}
                            {phoneTouched && phone.length > 0 && !phoneValid && (
                                <Text style={styles.errorText}>올바른 연락처를 입력해 주세요.</Text>
                            )}
                        </View>
                    </View>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.fieldLabel}>가격</Text>
                    <Text style={styles.priceValue}>{totalPrice.toLocaleString()}</Text>
                </View>

                {submitError && <Text style={styles.submitErrorText}>{submitError}</Text>}
            </ScrollView>

            <BottomActionBar
                label={roomName}
                disabled={!formValid || submitting}
                onPress={handleSubmit}
                bottomOffset={keyboardOffset}
            />

            <MessageModal
                visible={showConfirm}
                message="예약이 완료되었습니다."
                onConfirm={handleConfirmClose}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: "#FFFFFF" },
    content: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: BOTTOM_ACTION_BAR_CLEARANCE + 40,
    },
    sectionLabel: {
        backgroundColor: "#EFEFEF",
        borderRadius: 8,
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginBottom: 28,
    },
    sectionLabelText: {
        fontSize: 18,
        fontFamily: fonts.bold,
        color: "#000000",
    },
    dateRow: {
        flexDirection: "row",
        marginBottom: 24,
    },
    dateColumn: {
        flex: 1,
        alignItems: "center",
    },
    fieldLabel: {
        fontSize: 15,
        fontFamily: fonts.bold,
        color: "#000000",
        marginBottom: 10,
        alignSelf: "flex-start",
    },
    dateValue: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: "#333333",
        marginTop: 12, 
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 22, 
        marginBottom: 28,
    },
    summaryValue: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: "#000000",
    },
    inputRow: {
        marginTop: 10, 
        marginBottom: 30,
    },
    inputLine: {
        flexDirection: "row",
        alignItems: "flex-start",
    },
    inputLabel: {
        width: 70,
        fontSize: 15,
        fontFamily: fonts.bold,
        color: "#000000",
        marginTop: 10,
    },
    inputColumn: {
        width: "77%",
        marginLeft: "auto",
    },
    inputWrapper: {
        flexDirection: "row",
        alignItems: "flex-start",
        borderBottomWidth: 1,
        borderBottomColor: "#D9D9D9",
        paddingBottom: 12,
    },
    inputWrapperError: {
        borderBottomColor: "#FF0000",
    },
    input: {
        flex: 1,
        fontSize: 15,
        fontFamily: fonts.medium,
        color: "#000000",
        padding: 0,
        paddingLeft: 24, 
        marginTop: 10, 
    },
    clearButton: {
        width: 18,
        height: 18,
        borderRadius: 9,
        backgroundColor: "#C4C4C4",
        alignItems: "center",
        justifyContent: "center",
        marginTop: 10,
    },
    errorText: {
        fontSize: 12,
        fontFamily: fonts.medium,
        color: "#FF0000",
        paddingLeft: 24, 
        marginTop: 8,
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8,
    },
    priceValue: {
        fontSize: 22,
        fontFamily: fonts.bold,
        color: "#000000",
    },
    submitErrorText: {
        fontSize: 13,
        fontFamily: fonts.medium,
        color: "#FF0000",
        paddingLeft: 24, 
        marginTop: 16,
        textAlign: "center",
    },
});

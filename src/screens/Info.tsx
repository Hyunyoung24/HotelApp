import { ScrollView, Text, View, StyleSheet } from "react-native";
import BackHeader from "../components/BackHeader";
import { fonts } from "../theme";

type InfoRow = { label: string; value: string };
type InfoGroup = { title: string; rows: InfoRow[] };

const INFO_GROUPS: InfoGroup[] = [
    {
        title: "체크인 / 체크아웃",
        rows: [
            { label: "체크인", value: "15:00" },
            { label: "체크아웃", value: "11:00" },
        ],
    },
    {
        title: "부대시설 이용시간",
        rows: [
            { label: "조식 레스토랑", value: "07:00 - 10:00" },
            { label: "실내 수영장", value: "07:00 - 21:00" },
            { label: "피트니스 센터", value: "06:00 - 22:00" },
            { label: "스파 & 사우나", value: "10:00 - 22:00" },
        ],
    },
    {
        title: "이용 안내",
        rows: [
            { label: "주차", value: "투숙객 무료 주차 (1박 1대)" },
            { label: "흡연", value: "전 객실 금연, 옥상 흡연구역 이용" },
            { label: "반려동물", value: "객실 동반 불가" },
            { label: "조식 포함 여부", value: "객실 요금에 미포함 (현장 결제)" },
        ],
    },
    {
        title: "문의처",
        rows: [
            { label: "프런트 데스크", value: "02-1234-5678" },
            { label: "이메일", value: "contact@hotelh.com" },
            { label: "운영시간", value: "24시간 연중무휴" },
        ],
    },
];

export default function Info() {
    return (
        <View style={styles.flex}>
            <BackHeader title="Info" />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
                {INFO_GROUPS.map((group) => (
                    <View key={group.title} style={styles.group}>
                        <Text style={styles.groupTitle}>{group.title}</Text>
                        {group.rows.map((row) => (
                            <View key={row.label} style={styles.row}>
                                <Text style={styles.rowLabel}>{row.label}</Text>
                                <Text style={styles.rowValue}>{row.value}</Text>
                            </View>
                        ))}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: "#FFFFFF" },
    content: { paddingBottom: 60 },
    group: {
        marginBottom: 6,
    },
    groupTitle: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: "#000000",
        backgroundColor: "#EFEFEF",
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: "#F2F2F2",
    },
    rowLabel: {
        fontSize: 15,
        fontFamily: fonts.bold,
        color: "#000000",
    },
    rowValue: {
        fontSize: 15,
        fontFamily: fonts.medium,
        color: "#555555",
    },
});

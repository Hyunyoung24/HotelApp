import { useEffect, useMemo, useRef, useState } from "react";
import {
    Animated,
    Dimensions,
    ScrollView,
    Text,
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
import { useRooms, usePrices, useSeasons, useHolidays, useReservations } from "../hooks";
import { fonts } from "../theme";
import type { RootStackParamList } from "../navigation/types";

const SCREEN_WIDTH = Dimensions.get("window").width;
const CONTENT_PADDING = 20;
const CELL_SIZE = (SCREEN_WIDTH - CONTENT_PADDING * 2) / 7;
const MS_PER_DAY = 24 * 60 * 60 * 1000;
const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];
const MAX_NIGHTS = 5;

type Cell = { date: Date; inCurrentMonth: boolean };

function stripTime(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function pad(n: number) {
    return String(n).padStart(2, "0");
}

function toISODate(date: Date) {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function toDisplayDate(date: Date) {
    return `${date.getFullYear()}.${pad(date.getMonth() + 1)}.${pad(date.getDate())}`;
}

function parseISODate(value: string) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, m - 1, d);
}

function toMonthDayNum(date: Date) {
    return (date.getMonth() + 1) * 100 + date.getDate();
}

function buildCalendarCells(year: number, month: number): Cell[] {
    const firstOfMonth = new Date(year, month, 1);
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();
    const totalCells = 42; // 항상 6주(6줄) 고정 - 부족한 칸은 다음 달 날짜로 채움

    const cells: Cell[] = [];
    for (let i = 0; i < totalCells; i++) {
        const dayOffset = i - startWeekday;
        if (dayOffset < 0) {
            const day = daysInPrevMonth + dayOffset + 1;
            cells.push({ date: new Date(year, month - 1, day), inCurrentMonth: false });
        } else if (dayOffset >= daysInMonth) {
            const day = dayOffset - daysInMonth + 1;
            cells.push({ date: new Date(year, month + 1, day), inCurrentMonth: false });
        } else {
            cells.push({ date: new Date(year, month, dayOffset + 1), inCurrentMonth: true });
        }
    }
    return cells;
}

export default function ReservationDate() {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const route = useRoute<RouteProp<RootStackParamList, "ReservationDate">>();
    const { roomId } = route.params;

    const { rooms } = useRooms();
    const { prices } = usePrices();
    const { seasons } = useSeasons();
    const { holidays } = useHolidays();
    const { reservations } = useReservations();

    const room = useMemo(() => rooms.find((r) => Number(r.id) === Number(roomId)), [rooms, roomId]);

    const today = useMemo(() => stripTime(new Date()), []);
    const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));
    const [start, setStart] = useState<Date | null>(null);
    const [end, setEnd] = useState<Date | null>(null);
    const [guestAdd, setGuestAdd] = useState(0);
    const [showCapacityModal, setShowCapacityModal] = useState(false);
    const capacitySheetAnim = useRef(new Animated.Value(0)).current;
    const [showWarnModal, setShowWarnModal] = useState(false);

    useEffect(() => {
        Animated.timing(capacitySheetAnim, {
            toValue: showCapacityModal ? 1 : 0,
            duration: showCapacityModal ? 375 : 300,
            useNativeDriver: true,
        }).start();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showCapacityModal]);

    const bookedRanges = useMemo(() => {
        return reservations
            .filter((r) => Number(r.room_id) === Number(roomId))
            .map((r) => ({
                start: parseISODate(r.check_in_date),
                end: parseISODate(r.check_out_date),
            }));
    }, [reservations, roomId]);

    const isBooked = (date: Date) =>
        bookedRanges.some((r) => date.getTime() >= r.start.getTime() && date.getTime() < r.end.getTime());

    const rangeOverlapsBooked = (from: Date, to: Date) =>
        bookedRanges.some((r) => from.getTime() < r.end.getTime() && to.getTime() > r.start.getTime());

    const handleSelectDate = (date: Date, disabled: boolean) => {
        if (disabled) return;
        const time = date.getTime();

        // 입실/퇴실이 둘 다 선택된 상태
        if (start && end) {
            if (time === end.getTime()) {
                // 퇴실 날짜를 다시 누르면 퇴실 선택만 해제
                setEnd(null);
                return;
            }
            // 그 외엔 새로 선택 시작
            setStart(date);
            setEnd(null);
            return;
        }

        // 입실만 선택된 상태
        if (start && !end) {
            if (time === start.getTime()) {
                // 입실 날짜를 다시 누르면 선택 해제
                setStart(null);
                return;
            }

            if (time < start.getTime()) {
                // 입실보다 이전 날짜를 누르면 입실<->퇴실 스왑
                const newStart = date;
                const newEnd = start;
                const nights = Math.round((newEnd.getTime() - newStart.getTime()) / MS_PER_DAY);
                if (nights > MAX_NIGHTS) {
                    setShowWarnModal(true);
                    return;
                }
                if (rangeOverlapsBooked(newStart, newEnd)) {
                    setStart(date);
                    setEnd(null);
                    return;
                }
                setStart(newStart);
                setEnd(newEnd);
                return;
            }

            const nights = Math.round((time - start.getTime()) / MS_PER_DAY);
            if (nights > MAX_NIGHTS) {
                setShowWarnModal(true);
                return;
            }

            if (rangeOverlapsBooked(start, date)) {
                setStart(date);
                setEnd(null);
                return;
            }

            setEnd(date);
            return;
        }

        // 아무것도 선택 안 된 상태
        setStart(date);
        setEnd(null);
    };

    const cells = useMemo(
        () => buildCalendarCells(viewDate.getFullYear(), viewDate.getMonth()),
        [viewDate],
    );

    const isCurrentViewMonth =
        viewDate.getFullYear() === today.getFullYear() && viewDate.getMonth() === today.getMonth();

    const getSeasonForDate = (date: Date) => {
        const md = toMonthDayNum(date);
        return (
            seasons.find((season) => {
                const startMd = toMonthDayNum(parseISODate(season.start_date));
                const endMd = toMonthDayNum(parseISODate(season.end_date));
                if (startMd <= endMd) return md >= startMd && md <= endMd;
                return md >= startMd || md <= endMd;
            }) ?? seasons[0]
        );
    };

    const isHolidayDate = (date: Date) => {
        const iso = toISODate(date);
        return holidays.some((h) => h.holiday_date === iso);
    };

    const getNightPrice = (date: Date) => {
        if (!room) return 0;
        const season = getSeasonForDate(date);
        if (!season) return 0;
        const priceRow = prices.find(
            (p) => Number(p.room_id) === Number(room.id) && Number(p.season_id) === Number(season.id),
        );
        if (!priceRow) return 0;
        if (isHolidayDate(date)) return priceRow.holiday_price;
        const day = date.getDay();
        if (day === 5 || day === 6) return priceRow.weekend_price;
        return priceRow.weekday_price;
    };

    const totalPrice = useMemo(() => {
        if (!start || !end) return 0;
        let total = 0;
        for (let d = new Date(start); d.getTime() < end.getTime(); d.setDate(d.getDate() + 1)) {
            total += getNightPrice(d);
        }
        // 추가 인원 1명당 1박 요금의 20%씩 가산
        return Math.round(total * (1 + guestAdd * 0.2));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [start, end, prices, seasons, holidays, room, guestAdd]);

    if (!room) {
        return <View style={styles.flex} />;
    }

    const maxAddable = Math.max(0, room.capacity - room.min);
    const guestOptions = Array.from({ length: maxAddable + 1 }, (_, i) => i);

    const handleNext = () => {
        if (!start || !end) return;
        navigation.navigate("ReservationInfo", {
            roomId: Number(room.id),
            checkIn: toISODate(start),
            checkOut: toISODate(end),
            guests: guestAdd,
            totalPrice,
        });
    };

    return (
        <View style={styles.flex}>
            <BackHeader title="Schedule" />
            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.sectionLabel}>
                    <Text style={styles.sectionLabelText}>Calendar</Text>
                </View>

                <View style={styles.monthNav}>
                    <TouchableOpacity
                        onPress={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
                        disabled={isCurrentViewMonth}
                        style={styles.monthNavButton}
                    >
                        <Feather name="chevron-left" size={28} color={isCurrentViewMonth ? "#D0D0D0" : "#000000"} />
                    </TouchableOpacity>
                    <Text style={styles.monthText}>
                        {viewDate.getFullYear()}년 {viewDate.getMonth() + 1}월
                    </Text>
                    <TouchableOpacity
                        onPress={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
                        style={styles.monthNavButton}
                    >
                        <Feather name="chevron-right" size={28} color="#000000" />
                    </TouchableOpacity>
                </View>

                <View style={styles.weekRow}>
                    {WEEKDAYS.map((w) => (
                        <Text key={w} style={[styles.weekDayText, w === "일" && styles.sundayText]}>
                            {w}
                        </Text>
                    ))}
                </View>

                <View style={styles.grid}>
                    {cells.map((cell, index) => {
                        const time = cell.date.getTime();
                        const isStartDate = start?.getTime() === time;
                        const isEndDate = end?.getTime() === time;
                        const selected = isStartDate || isEndDate;
                        const inRange = !!start && !!end && time > start.getTime() && time < end.getTime();
                        const booked = isBooked(cell.date);
                        const past = time <= today.getTime();
                        const disabled = !cell.inCurrentMonth || past || booked;
                        const holiday = isHolidayDate(cell.date);

                        return (
                            <TouchableOpacity
                                key={index}
                                style={styles.cell}
                                disabled={disabled}
                                onPress={() => handleSelectDate(cell.date, disabled)}
                            >
                                {inRange && <View style={styles.rangeBg} />}
                                {isStartDate && !!end && <View style={styles.rangeBgStart} />}
                                {isEndDate && !!start && <View style={styles.rangeBgEnd} />}
                                <View style={[styles.dayCircle, selected && styles.dayCircleSelected]}>
                                    <Text
                                        style={[
                                            styles.dayText,
                                            !cell.inCurrentMonth && styles.dayTextMuted,
                                            cell.inCurrentMonth && cell.date.getDay() === 0 && styles.sundayText,
                                            cell.inCurrentMonth && holiday && styles.sundayText,
                                            past && styles.dayTextMuted,
                                            booked && styles.dayTextMuted,
                                            (selected || inRange) && styles.dayTextSelected,
                                        ]}
                                    >
                                        {cell.date.getDate()}
                                    </Text>
                                </View>
                                {booked && cell.inCurrentMonth && (
                                    <Text style={styles.bookedLabel}>예약완료</Text>
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </View>

                <View style={styles.dateRow}>
                    <View style={styles.dateColumn}>
                        <Text style={styles.fieldLabel}>입실</Text>
                        <View style={styles.dateBox}>
                            <Text style={[styles.dateBoxText, !start && styles.placeholderText]}>
                                {start ? toDisplayDate(start) : "선택없음"}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.dateColumn}>
                        <Text style={styles.fieldLabel}>퇴실</Text>
                        <View style={styles.dateBox}>
                            <Text style={[styles.dateBoxText, !end && styles.placeholderText]}>
                                {end ? toDisplayDate(end) : "선택없음"}
                            </Text>
                        </View>
                    </View>
                </View>

                <View style={styles.summaryRow}>
                    <Text style={[styles.fieldLabel, styles.summaryLabel]}>인원 추가</Text>
                    <TouchableOpacity
                        style={styles.guestChip}
                        disabled={maxAddable <= 0}
                        onPress={() => setShowCapacityModal(true)}
                    >
                        <Text style={styles.guestChipText}>
                            {guestAdd > 0 ? `${guestAdd}명` : "추가없음"}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.priceRow}>
                    <Text style={styles.fieldLabel}>가격</Text>
                    <Text style={styles.priceValue}>{totalPrice.toLocaleString()}</Text>
                </View>
            </ScrollView>

            <BottomActionBar
                label={room.name_eng.toUpperCase()}
                disabled={!start || !end}
                onPress={handleNext}
            />

            <MessageModal
                visible={showWarnModal}
                message="6일 이상 예약하실 수 없습니다."
                onConfirm={() => setShowWarnModal(false)}
            />

            <View
                style={styles.capacityRoot}
                pointerEvents={showCapacityModal ? "auto" : "none"}
            >
                <TouchableOpacity
                    style={StyleSheet.absoluteFill}
                    activeOpacity={1}
                    onPress={() => setShowCapacityModal(false)}
                >
                    <Animated.View
                        style={[styles.capacityBackdropFade, { opacity: capacitySheetAnim }]}
                    />
                </TouchableOpacity>
                <Animated.View
                    style={[
                        styles.capacityCard,
                        {
                            transform: [
                                {
                                    translateY: capacitySheetAnim.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [400, 0],
                                    }),
                                },
                            ],
                        },
                    ]}
                >
                    <Text style={styles.capacityTitle}>인원 추가</Text>
                    {guestOptions.map((n) => (
                        <TouchableOpacity
                            key={n}
                            style={styles.capacityOption}
                            onPress={() => {
                                setGuestAdd(n);
                                setShowCapacityModal(false);
                            }}
                        >
                            <Text
                                style={[
                                    styles.capacityOptionText,
                                    guestAdd === n && styles.capacityOptionTextActive,
                                ]}
                            >
                                {n === 0 ? "추가없음" : `${n}명`}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: "#FFFFFF" },
    content: {
        paddingHorizontal: CONTENT_PADDING,
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
    monthNav: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginTop: 12, 
        marginBottom: 36,
        paddingHorizontal: 12, 
    },
    monthNavButton: {
        width: 32,
        height: 32,
        alignItems: "center",
        justifyContent: "center",
    },
    monthText: {
        fontSize: 20,
        fontFamily: fonts.bold,
        color: "#000000",
    },
    weekRow: {
        flexDirection: "row",
        marginBottom: 16,
    },
    weekDayText: {
        width: CELL_SIZE,
        textAlign: "center",
        fontSize: 16,
        fontFamily: fonts.medium,
        color: "#000000",
    },
    sundayText: {
        color: "#FF0000",
    },
    grid: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 28,
    },
    cell: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        alignItems: "center",
        justifyContent: "center",
    },
    dayCircle: {
        width: CELL_SIZE * 0.72,
        height: CELL_SIZE * 0.72,
        borderRadius: (CELL_SIZE * 0.72),
        alignItems: "center",
        justifyContent: "center",
    },
    dayCircleSelected: {
        backgroundColor: "#30BD5E",
        borderRadius: (CELL_SIZE * 0.72),
    },
    rangeBg: {
        position: "absolute",
        left: 0,
        right: 0,
        top: "18%",
        bottom: "18%",
        backgroundColor: "#30BD5E99",
    },
    rangeBgStart: {
        position: "absolute",
        left: "50%",
        right: 0,
        top: "18%",
        bottom: "18%",
        backgroundColor: "#30BD5E99",
    },
    rangeBgEnd: {
        position: "absolute",
        left: 0,
        right: "50%",
        top: "18%",
        bottom: "18%",
        backgroundColor: "#30BD5E99",
    },
    dayText: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: "#000000",
    },
    dayTextMuted: {
        color: "#C4C4C4",
    },
    dayTextSelected: {
        color: "#FFFFFF",
        fontFamily: fonts.bold,
    },
    bookedLabel: {
        position: "absolute",
        bottom: 4,
        fontSize: 8,
        fontFamily: fonts.medium,
        color: "#FF0000",
    },
    dateRow: {
        flexDirection: "row",
        gap: 16,
        marginBottom: 24,
    },
    dateColumn: {
        flex: 1,
    },
    fieldLabel: {
        fontSize: 15,
        fontFamily: fonts.bold,
        color: "#000000",
        marginBottom: 10,
    },
    dateBox: {
        backgroundColor: "#EFEFEF",
        borderRadius: 6,
        paddingVertical: 14,
        alignItems: "center",
    },
    dateBoxText: {
        fontSize: 14,
        fontFamily: fonts.medium,
        color: "#000000",
    },
    placeholderText: {
        color: "#B0B0B0",
    },
    summaryRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 8, 
        marginBottom: 24,
    },
    summaryLabel: {
        marginBottom: 0,
    },
    guestChip: {
        backgroundColor: "#EFEFEF",
        borderRadius: 6,
        paddingVertical: 12,
        paddingHorizontal: 20,
    },
    guestChipText: {
        fontSize: 14,
        fontFamily: fonts.medium,
        color: "#000000",
    },
    priceRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 16,
    },
    priceValue: {
        fontSize: 22,
        fontFamily: fonts.bold,
        color: "#000000",
    },
    capacityRoot: {
        ...StyleSheet.absoluteFill,
        justifyContent: "flex-end",
    },
    capacityBackdropFade: {
        ...StyleSheet.absoluteFill,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
    },
    capacityCard: {
        width: "100%",
        backgroundColor: "#FFFFFF",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        paddingBottom: 52,
    },
    capacityTitle: {
        fontSize: 16,
        fontFamily: fonts.medium,
        color: "#000000",
        marginTop: 8, 
        marginBottom: 28,
    },
    capacityOption: {
        backgroundColor: "#EFEFEF",
        borderRadius: 8,
        paddingVertical: 16,
        alignItems: "center",
        marginBottom: 16,
    },
    capacityOptionText: {
        fontSize: 15,
        fontFamily: fonts.medium,
        color: "#000000",
    },
    capacityOptionTextActive: {
        color: "#30BD5E",
        fontFamily: fonts.medium,
    },
});

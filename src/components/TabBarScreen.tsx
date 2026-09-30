import type { ReactNode } from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TAB_BAR_HEIGHT } from "./TabBar";
import { HEADER_HEIGHT } from "./Header";

type Props = { children: ReactNode };

export default function TabBarScreen({ children }: Props) {
    const insets = useSafeAreaInsets();

    return (
        <View style={styles.container}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingTop: HEADER_HEIGHT + insets.top + 12,
                    paddingBottom: TAB_BAR_HEIGHT + 40,
                }}
            >
                {children}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#FFFFFF" },
});
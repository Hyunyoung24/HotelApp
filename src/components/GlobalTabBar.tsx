import TabBar from "./TabBar.tsx";
import type { TabKey } from "./TabBar.tsx";
import type { NavigationContainerRefWithCurrent } from "@react-navigation/native";
import type { RootStackParamList } from "../navigation/types.ts";
import { useMenu } from "../context/MenuContext.tsx";

const TAB_ROUTES: Partial<Record<string, TabKey>> = {
    Home: "home",
    RoomList: "reservation",
};

type Props = {
    routeName?: string;
    navigationRef: NavigationContainerRefWithCurrent<RootStackParamList>;
};

export default function GlobalTabBar({ routeName, navigationRef }: Props) {
    const { isMenuOpen } = useMenu();
    const routeActive = routeName ? TAB_ROUTES[routeName] : undefined;
    const active = isMenuOpen ? "menu" : routeActive;

    if (!active) {
        return null;
    }

    return <TabBar active={active} navigationRef={navigationRef} />;
}
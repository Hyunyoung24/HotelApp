import { createStackNavigator, CardStyleInterpolators } from "@react-navigation/stack";
import type { RootStackParamList } from "./types";
import Splash from "../screens/Splash";
import Home from "../screens/Home";
import RoomList from "../screens/RoomList";
import RoomDetail from "../screens/RoomDetail";
import ReservationDate from "../screens/ReservationDate";
import ReservationInfo from "../screens/ReservationInfo";
import About from "../screens/About";
import Info from "../screens/Info";

const Stack = createStackNavigator<RootStackParamList>()

export default function RootNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false, cardOverlayEnabled: false }}
        >
            <Stack.Screen
                name="Splash" 
                component={Splash}
            />
            <Stack.Screen
                name="Home"
                component={Home}
                options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
            />
            <Stack.Screen
                name="RoomList"
                component={RoomList}
                options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
            />
            <Stack.Screen
                name="RoomDetail" 
                component={RoomDetail}
            />
            <Stack.Screen
                name="ReservationDate" 
                component={ReservationDate}
            />
            <Stack.Screen
                name="ReservationInfo"
                component={ReservationInfo}
            />
            <Stack.Screen
                name="About"
                component={About}
                options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
            />
            <Stack.Screen
                name="Info"
                component={Info}
                options={{ cardStyleInterpolator: CardStyleInterpolators.forNoAnimation }}
            />
        </Stack.Navigator>
    );
}
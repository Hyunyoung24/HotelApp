import { createStackNavigator } from "@react-navigation/stack";
import type { RootStackParamList } from "./types";
import Splash from "../screens/Splash";
import Home from "../screens/Home";
import RoomList from "../screens/RoomList";
import RoomDetail from "../screens/RoomDetail";
import ReservationDate from "../screens/ReservationDate";
import ReservationInfo from "../screens/ReservationInfo";
import Menu from "../screens/Menu";

const Stack = createStackNavigator<RootStackParamList>()

export default function RootNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{ headerShown: false }}
        >
            <Stack.Screen
                name="Splash" 
                component={Splash}
            />
            <Stack.Screen
                name="Home" 
                component={Home}
            />
            <Stack.Screen
                name="RoomList" 
                component={RoomList}
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
                name="Menu" 
                component={Menu} 
                options={{ presentation: "transparentModal" }} 
            />
        </Stack.Navigator>
    );
}
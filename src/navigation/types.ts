export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  RoomList: undefined;
  RoomDetail: { roomId: number };
  ReservationDate: { roomId: number };
  ReservationInfo: {
    roomId: number;
    checkIn: string;
    checkOut: string;
    guests: number;
    totalPrice: number;
  };
  Menu: undefined;
  About: undefined;
  Info: undefined;
};
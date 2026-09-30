export const fonts = {
    bold: "KOROAD_Bold",
    medium: "KOROAD_Medium",
    light: "KOROAD_Light",
};

export const ROOM_IMAGES: Record<string, ReturnType<typeof require>> = {
    standard: require("./assets/images/rooms_standard.jpg"),
    deluxe: require("./assets/images/rooms_deluxe.jpg"),
    premium: require("./assets/images/rooms_premium.jpg"),
    sweet: require("./assets/images/rooms_sweet.jpg"),
};

// db.json room.images에 들어있는 파일명 -> 실제 에셋 매핑 (RoomDetail 갤러리용)
export const ROOM_GALLERY_IMAGES: Record<string, ReturnType<typeof require>> = {
    "room1.jpg": require("./assets/images/room1.jpg"),
    "room2.jpg": require("./assets/images/room2.jpg"),
    "room3.jpg": require("./assets/images/room3.jpg"),
    "room4.jpg": require("./assets/images/room4.jpg"),
    "room5.jpg": require("./assets/images/room5.jpg"),
    "room6.jpg": require("./assets/images/room6.jpg"),
    "room7.jpg": require("./assets/images/room7.jpg"),
    "sm_room_1.jpg": require("./assets/images/sm_room_1.jpg"),
    "sm_room_2.jpg": require("./assets/images/sm_room_2.jpg"),
    "sm_room_3.jpg": require("./assets/images/sm_room_3.jpg"),
    "sm_room_4.jpg": require("./assets/images/sm_room_4.jpg"),
    "sm_room_5.jpg": require("./assets/images/sm_room_5.jpg"),
    "sm_room_6.jpg": require("./assets/images/sm_room_6.jpg"),
};

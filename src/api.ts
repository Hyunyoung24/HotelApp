export type Room = {
    id: number;
    name: string;
    name_eng: string;
    area: number;
    capacity: number;
    min: number;
    is_liked: boolean;
    images: string[];
    desc: string;
    desc_eng: string;
};

export type Season = {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
};

export type Holiday = {
    id: number;
    holiday_name: string;
    holiday_date: string;
};

export type Price = {
    id: number;
    room_id: number;
    season_id: number;
    weekday_price: number;
    weekend_price: number;
    holiday_price: number;
};

export type Reservation = {
    id: number;
    customer_name: string;
    phone_number: string;
    room_id: number;
    check_in_date: string;
    check_out_date: string;
    number_of_guests: number;
    total_price: number;
};

const BASE_URL = "http://10.0.2.2:3000";

async function request<T>(path: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${BASE_URL}${path}`, {
        headers: { "Content-Type": "application/json" },
        ...options,
    });

    if (!response.ok) {
        throw new Error(`API 요청 실패: ${path} (${response.status})`);
    }

    return response.json();
}

const api = {
    get: <T>(path: string) => request<T>(path),
    post: <T>(path: string, body: unknown) =>
        request<T>(path, { method: "POST", body: JSON.stringify(body) }),
    patch: <T>(path: string, body: unknown) =>
        request<T>(path, { method: "PATCH", body: JSON.stringify(body) }),
};

export function getRooms() {
    return api.get<Room[]>("/rooms");
}

export function getRoom(id: number) {
    return api.get<Room>(`/rooms/${id}`);
}

export function toggleRoomLike(id: number, isLiked: boolean) {
    return api.patch<Room>(`/rooms/${id}`, { is_liked: isLiked });
}

export function getPrices() {
    return api.get<Price[]>("/price");
}

export function getSeasons() {
    return api.get<Season[]>("/season");
}

export function getHolidays() {
    return api.get<Holiday[]>("/holiday");
}

export function getReservations() {
    return api.get<Reservation[]>("/reservation");
}

export function createReservation(reservation: Omit<Reservation, "id">) {
    return api.post<Reservation>("/reservation", reservation);
}

import Header from "./Header";

const HEADER_ROUTES = ["Home", "RoomList"];

type Props = {
    routeName?: string;
};

export default function GlobalHeader({ routeName }: Props) {
    if (!routeName || !HEADER_ROUTES.includes(routeName)) {
        return null;
    }

    return <Header />;
}
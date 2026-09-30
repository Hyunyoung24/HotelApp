import TabBarScreen from "../components/TabBarScreen";
import BannerCarousel from "../components/BannerCarousel";
import RoomsSection from "../components/RoomsSection";
import EventSection from "../components/EventSection";

export default function Home() {
    return (
        <TabBarScreen>
            <BannerCarousel />
            <RoomsSection />
            <EventSection />
        </TabBarScreen>
    )
}
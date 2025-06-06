import { createRootRoute, Outlet } from '@tanstack/react-router';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useHeaderHeightAdjustment } from "../useHeaderHeightAdjustment.js";

export const Route = createRootRoute({
    component: RootComponent
});

function RootComponent() {
    const headerHeight = useHeaderHeightAdjustment();


    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main
                className="flex-1 w-full"
                style={{
                    marginTop: `${headerHeight}px`,
                }}
            >
                <Outlet />
            </main>
            <BottomNav />
            <Footer />
        </div>
    );
}
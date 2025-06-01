import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BottomNav from "../components/BottomNav.jsx";
import { useHeaderHeightAdjustment } from "../useHeaderHeightAdjustment.js";
import { useFooterHeightAdjustment } from "../useFooterHeightAdjustment.js";

export const Route = createRootRoute({
    component: () => {
        const headerHeight = useHeaderHeightAdjustment();
        const footerHeight = useFooterHeightAdjustment();

        return (
            <div className="min-h-screen flex flex-col">
                <Header />
                <main 
                    className="flex-1 w-full"
                    style={{
                        marginTop: `${headerHeight}px`,
                        marginBottom: `${footerHeight}px`
                    }}
                >
                    <Outlet />
                </main>
                <BottomNav />
                <Footer />
            </div>
        );
    },
});
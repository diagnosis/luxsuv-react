import { createRootRoute, Outlet } from '@tanstack/react-router';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BottomNav from "../components/BottomNav.jsx";

export const Route = createRootRoute({
    component: RootComponent
});

function RootComponent() {
    return (
        <div className="h-screen flex flex-col">
            {/* Header - 10% on all screens */}
            <div className="h-[10vh] flex-shrink-0">
                <Header />
            </div>
            
            {/* Main content - fills remaining space minus bottom nav on mobile */}
            <main className="flex-1 overflow-y-auto md:h-[65vh] md:flex-shrink-0">
                <Outlet />
            </main>
            
            {/* Footer/BottomNav - 25% on desktop, slightly bigger on mobile */}
            <div className="h-16 md:h-[25vh] flex-shrink-0">
                <BottomNav />
                <Footer />
            </div>
        </div>
    );
}
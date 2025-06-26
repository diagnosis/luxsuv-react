import { createRootRoute, Outlet } from '@tanstack/react-router';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BottomNav from "../components/BottomNav.jsx";

export const Route = createRootRoute({
    component: RootComponent
});

function RootComponent() {
    return (
        <div className="h-screen flex flex-col overflow-hidden">
            {/* Header - 10% on large screens, 10% on mobile */}
            <div className="h-[10vh] flex-shrink-0">
                <Header />
            </div>
            
            {/* Main content - 65% on large screens, 80% on mobile */}
            <main className="h-[65vh] md:h-[65vh] sm:h-[80vh] flex-shrink-0 overflow-y-auto">
                <Outlet />
            </main>
            
            {/* Footer/BottomNav - 25% on large screens, 10% on mobile */}
            <div className="h-[25vh] md:h-[25vh] sm:h-[10vh] flex-shrink-0">
                <BottomNav />
                <Footer />
            </div>
        </div>
    );
}
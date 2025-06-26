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
            {/* Header - 15% of viewport height */}
            <div className="h-[15vh] flex-shrink-0">
                <Header />
            </div>
            
            {/* Main content - 65% of viewport height */}
            <main className="h-[65vh] flex-shrink-0 overflow-y-auto">
                <Outlet />
            </main>
            
            {/* Footer - 20% of viewport height */}
            <div className="h-[20vh] flex-shrink-0">
                <BottomNav />
                <Footer />
            </div>
        </div>
    );
}
import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";
import BottomNav from "../components/BottomNav.jsx";

export const Route = createRootRoute({
    component: () => (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full pb-16 md:pb-0">
                <Outlet />
            </main>
            <BottomNav />
            <Footer />
        </div>
    ),
});
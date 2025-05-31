import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/router-devtools';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export const Route = createRootRoute({
    component: () => (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 w-full">
                <Outlet />
            </main>
            <Footer />
            <TanStackRouterDevtools />
        </div>
    ),
});
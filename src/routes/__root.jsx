import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import Header from "../components/Header.jsx";
import Footer from "../components/Footer.jsx";

export const Route = createRootRoute({
    component: () => (
        <>
            <Header />
            <Outlet />
            <Footer />
            <TanStackRouterDevtools />
        </>
    ),
});
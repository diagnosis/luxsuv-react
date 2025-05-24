import { createRootRoute, Link, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import Header from "../components/Header.jsx";

export const Route = createRootRoute({
    component: () => (
        <>
            <Header></Header>
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})
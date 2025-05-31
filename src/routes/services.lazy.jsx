import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/services')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/services"!</div>
}

import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/services')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-12 h-full">
        <h1 className="text-3xl font-bold mb-6 md:text-4xl">Our Services</h1>
        <p className="text-lg text-light/90">
          Discover our range of luxury transportation services designed for your comfort and convenience.
        </p>
      </div>
    </div>
  )
}
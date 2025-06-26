import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-12 h-full">
        <h1 className="text-3xl font-bold mb-6 md:text-4xl">About LUX SUV</h1>
        <p className="text-lg text-light/90">
          Welcome to our luxury SUV transportation service. We provide premium comfort and style for all your travel needs.
        </p>
      </div>
    </div>
  )
}
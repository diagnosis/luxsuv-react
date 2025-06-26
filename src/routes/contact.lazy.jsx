import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/contact')({
  component: Contact,
})

function Contact() {
  return (
    <div className="w-full h-full bg-dark text-light overflow-y-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-6 md:py-12 h-full">
        <h1 className="text-3xl font-bold mb-6 md:text-4xl">Contact Us</h1>
        <p className="text-lg text-light/90">
          Get in touch with our team for bookings, inquiries, or support.
        </p>
      </div>
    </div>
  )
}
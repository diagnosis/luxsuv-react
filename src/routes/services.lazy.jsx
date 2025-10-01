import { createLazyFileRoute } from '@tanstack/react-router'
import { Car, Clock, Shield, Star, MapPin, Users } from 'lucide-react'

export const Route = createLazyFileRoute('/services')({
  component: RouteComponent,
})

function RouteComponent() {
  const services = [
    {
      icon: Car,
      title: 'Airport Transfers',
      description: 'Reliable and punctual airport transportation. Our professional chauffeurs track your flight status and adjust pickup times accordingly, ensuring a stress-free arrival or departure.'
    },
    {
      icon: MapPin,
      title: 'City Tours',
      description: 'Explore the city in comfort and style. Our knowledgeable drivers can recommend the best routes and attractions, making your sightseeing experience unforgettable.'
    },
    {
      icon: Users,
      title: 'Corporate Travel',
      description: 'Professional transportation solutions for business meetings, conferences, and corporate events. Impress clients and colleagues with our premium SUV fleet.'
    },
    {
      icon: Star,
      title: 'Special Events',
      description: 'Make your special occasions even more memorable. Perfect for weddings, anniversaries, proms, and other celebrations requiring luxury transportation.'
    },
    {
      icon: Clock,
      title: 'Hourly Service',
      description: 'Flexible hourly bookings for multiple stops and extended travel needs. Ideal for shopping trips, business appointments, or any occasion requiring dedicated transportation.'
    },
    {
      icon: Shield,
      title: 'VIP Protection',
      description: 'Discreet and secure transportation services for high-profile clients. Our trained chauffeurs prioritize your safety and privacy at all times.'
    }
  ];

  const features = [
    'Luxury SUV fleet with latest models',
    'Professional, vetted chauffeurs',
    'Real-time GPS tracking',
    '24/7 customer support',
    'Complimentary refreshments',
    'Free WiFi in all vehicles'
  ];

  return (
    <div
      className="w-full h-full bg-cover bg-center bg-no-repeat text-light overflow-y-auto relative"
      style={{
        backgroundImage: 'url("../public/images/hero.jpg")',
        minHeight: '100%',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-dark/80"></div>

      {/* Content */}
      <div className="relative max-w-screen-xl mx-auto px-4 py-8 md:py-12 pb-24">
        <h1 className="text-4xl font-bold mb-4 md:text-5xl text-yellow">Our Services</h1>
        <p className="text-xl text-light/90 mb-12 max-w-3xl">
          Experience premium luxury transportation with our comprehensive range of professional chauffeur services.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/90 transition-all hover:shadow-xl hover:border-yellow/50"
              >
                <div className="bg-yellow/10 w-14 h-14 rounded-lg flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7 text-yellow" />
                </div>
                <h3 className="text-xl font-bold mb-3 text-light">{service.title}</h3>
                <p className="text-light/80 leading-relaxed">{service.description}</p>
              </div>
            );
          })}
        </div>

        {/* Features Section */}
        <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <h2 className="text-3xl font-bold mb-6 text-yellow">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow rounded-full flex-shrink-0"></div>
                <span className="text-light/90">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
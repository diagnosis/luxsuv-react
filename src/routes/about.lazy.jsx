import { createLazyFileRoute } from '@tanstack/react-router'
import { Award, Users, Globe, Heart, TrendingUp, Shield } from 'lucide-react'

export const Route = createLazyFileRoute('/about')({
  component: About,
})

function About() {
  const stats = [
    { number: '10+', label: 'Years of Excellence' },
    { number: '50K+', label: 'Happy Customers' },
    { number: '100%', label: 'Client Satisfaction' },
    { number: '24/7', label: 'Available Support' }
  ];

  const values = [
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety is our top priority. All our vehicles undergo regular maintenance and safety inspections.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, from vehicle quality to customer care.'
    },
    {
      icon: Heart,
      title: 'Customer Care',
      description: 'Building lasting relationships through exceptional service and personalized attention to detail.'
    },
    {
      icon: Globe,
      title: 'Sustainability',
      description: 'Committed to reducing our environmental footprint with eco-friendly practices and modern, efficient vehicles.'
    }
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
        <h1 className="text-4xl font-bold mb-4 md:text-5xl text-yellow">About LUX SUV</h1>
        <p className="text-xl text-light/90 mb-12 max-w-3xl leading-relaxed">
          Redefining luxury transportation with unparalleled comfort, style, and professionalism since 2015.
        </p>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-6 text-center hover:bg-gray-800/90 transition-all hover:border-yellow/50"
            >
              <div className="text-4xl font-bold text-yellow mb-2">{stat.number}</div>
              <div className="text-light/80">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-12">
          <h2 className="text-3xl font-bold mb-6 text-yellow">Our Story</h2>
          <div className="space-y-4 text-light/90 leading-relaxed">
            <p>
              Founded in 2015, LUX SUV was born from a simple vision: to provide luxury transportation that combines comfort, reliability, and professionalism. What started as a single luxury SUV has grown into a premier fleet serving thousands of satisfied clients.
            </p>
            <p>
              Our journey began when our founder, after years of experiencing subpar transportation services, decided to create something better. We built our company on the principles of punctuality, luxury, and customer satisfaction.
            </p>
            <p>
              Today, we're proud to be the preferred choice for airport transfers, corporate travel, special events, and city tours. Our team of professional chauffeurs and support staff work tirelessly to ensure every journey exceeds expectations.
            </p>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-yellow">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/90 transition-all hover:shadow-xl hover:border-yellow/50"
                >
                  <div className="flex items-start space-x-4">
                    <div className="bg-yellow/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-yellow" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold mb-2 text-light">{value.title}</h3>
                      <p className="text-light/80 leading-relaxed">{value.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-gray-800/70 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <div className="flex items-center space-x-3 mb-4">
            <Users className="w-8 h-8 text-yellow" />
            <h2 className="text-3xl font-bold text-yellow">Our Team</h2>
          </div>
          <p className="text-light/90 leading-relaxed mb-6">
            Behind every successful journey is a dedicated team of professionals. Our chauffeurs are carefully selected, thoroughly vetted, and extensively trained to provide the highest level of service. Each team member shares our commitment to excellence and passion for creating memorable experiences.
          </p>
          <div className="flex items-center space-x-3 text-yellow/90">
            <TrendingUp className="w-5 h-5" />
            <span className="font-semibold">Continuously improving to serve you better</span>
          </div>
        </div>
      </div>
    </div>
  )
}
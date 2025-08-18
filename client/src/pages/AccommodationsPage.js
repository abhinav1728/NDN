import React, { useState } from 'react';
import { 
  Wifi, 
  Car, 
  Coffee, 
  Utensils, 
  Bath, 
  Tv, 
  Wind, 
  Users,
  Star,
  Calendar,
  MapPin
} from 'lucide-react';
import BookingForm from '../components/booking/BookingForm';

const AccommodationsPage = () => {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showBookingForm, setShowBookingForm] = useState(false);

  const accommodations = [
    {
      id: 'standard',
      name: "Standard Room",
      price: 2500,
      image: "/assets/IMG-20250817-WA0009.jpg",
      images: [
        "/assets/IMG-20250817-WA0009.jpg",
        "/assets/IMG-20250817-WA0010.jpg",
        "/assets/IMG-20250817-WA0004.jpg"
      ],
      capacity: "2 Adults",
      size: "300 sq ft",
      description: "Our Standard Rooms offer comfortable accommodation with essential amenities for a peaceful farm stay. Perfect for couples or solo travelers seeking a quiet retreat.",
      amenities: [
        { icon: <Wind size={20} />, name: "Air Conditioning" },
        { icon: <Bath size={20} />, name: "Private Bathroom" },
        { icon: <Wifi size={20} />, name: "Free Wi-Fi" },
        { icon: <Coffee size={20} />, name: "Tea/Coffee Maker" },
        { icon: <Tv size={20} />, name: "LED TV" },
        { icon: <Car size={20} />, name: "Free Parking" }
      ],
      features: [
        "Garden view from window",
        "Comfortable double bed",
        "Work desk and chair",
        "24/7 room service",
        "Daily housekeeping",
        "Complimentary breakfast"
      ]
    },
    {
      id: 'deluxe',
      name: "Deluxe Room",
      price: 3500,
      image: "/assets/IMG-20250817-WA0010.jpg",
      images: [
        "/assets/IMG-20250817-WA0010.jpg",
        "/assets/IMG-20250817-WA0005.jpg",
        "/assets/IMG-20250817-WA0006.jpg"
      ],
      capacity: "4 Adults",
      size: "450 sq ft",
      description: "Our Deluxe Rooms provide spacious accommodation with premium amenities and beautiful farm views. Ideal for families or groups looking for extra comfort and luxury.",
      amenities: [
        { icon: <Wind size={20} />, name: "Premium AC" },
        { icon: <Bath size={20} />, name: "Luxury Bathroom" },
        { icon: <Wifi size={20} />, name: "High-Speed Wi-Fi" },
        { icon: <Coffee size={20} />, name: "Mini Bar" },
        { icon: <Tv size={20} />, name: "Smart TV" },
        { icon: <Utensils size={20} />, name: "In-room Dining" }
      ],
      features: [
        "Private balcony with farm view",
        "King-size bed + sofa bed",
        "Spacious seating area",
        "Premium toiletries",
        "Room service menu",
        "Welcome fruit basket"
      ]
    }
  ];

  const commonAmenities = [
    "Organic farm tour",
    "Farm-to-table dining",
    "Nature walking trails",
    "Outdoor seating areas",
    "Bonfire arrangements",
    "Bird watching spots",
    "Photography sessions",
    "Yoga and meditation space"
  ];

  const handleBookNow = (room) => {
    setSelectedRoom(room);
    setShowBookingForm(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/assets/IMG-20250817-WA0004.jpg')` }}
        />

        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-shadow-lg">
            Our Accommodations
          </h1>
          <p className="text-xl md:text-2xl text-shadow">
            Choose from our comfortable rooms designed for your perfect farm stay
          </p>
        </div>
      </section>

      {/* Accommodations Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-16">
            {accommodations.map((room, index) => (
              <div key={room.id} className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                {/* Images */}
                <div className={`space-y-4 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                  <div className="relative overflow-hidden rounded-lg shadow-lg">
                    <img
                      src={room.image}
                      alt={room.name}
                      className="w-full h-80 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full">
                      <span className="text-primary-600 font-bold text-lg">₹{room.price.toLocaleString()}/night</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {room.images.slice(1, 3).map((img, imgIndex) => (
                      <img
                        key={imgIndex}
                        src={img}
                        alt={`${room.name} view ${imgIndex + 1}`}
                        className="w-full h-32 object-cover rounded-lg shadow-md"
                      />
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-1 lg:row-start-1' : ''}`}>
                  <div>
                    <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">
                      {room.name}
                    </h2>
                    <div className="flex items-center space-x-4 text-gray-600 mb-4">
                      <div className="flex items-center space-x-1">
                        <Users size={16} />
                        <span className="text-sm">{room.capacity}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin size={16} />
                        <span className="text-sm">{room.size}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star size={16} className="text-yellow-500" />
                        <span className="text-sm">4.8/5</span>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                      {room.description}
                    </p>
                  </div>

                  {/* Amenities */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Room Amenities</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {room.amenities.map((amenity, amenityIndex) => (
                        <div key={amenityIndex} className="flex items-center space-x-3">
                          <div className="text-primary-600">
                            {amenity.icon}
                          </div>
                          <span className="text-gray-700 text-sm">{amenity.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Features */}
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Features</h3>
                    <div className="grid grid-cols-1 gap-2">
                      {room.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Book Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => handleBookNow(room)}
                      className="w-full btn-primary text-lg py-3 flex items-center justify-center space-x-2"
                    >
                      <Calendar size={20} />
                      <span>Book {room.name}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Common Amenities Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Farm Experience Included
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every stay includes access to our farm activities and natural experiences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {commonAmenities.map((amenity, index) => (
              <div key={index} className="text-center p-6 bg-gray-50 rounded-lg">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{amenity}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Policies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-8 text-center">
            Booking Policies
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Check-in & Check-out</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Check-in: 2:00 PM onwards</li>
                <li>• Check-out: 11:00 AM</li>
                <li>• Early check-in subject to availability</li>
                <li>• Late check-out available on request</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Cancellation Policy</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Free cancellation up to 48 hours</li>
                <li>• 50% refund for 24-48 hour cancellation</li>
                <li>• No refund for same-day cancellation</li>
                <li>• Rescheduling allowed once without charge</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">House Rules</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• No smoking inside rooms</li>
                <li>• Pets allowed with prior approval</li>
                <li>• Quiet hours: 10 PM - 7 AM</li>
                <li>• Maximum occupancy as per room type</li>
              </ul>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What's Included</h3>
              <ul className="space-y-2 text-gray-700">
                <li>• Complimentary breakfast</li>
                <li>• Farm tour and activities</li>
                <li>• Wi-Fi and parking</li>
                <li>• 24/7 front desk service</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      {showBookingForm && (
        <BookingForm
          selectedRoom={selectedRoom}
          onClose={() => {
            setShowBookingForm(false);
            setSelectedRoom(null);
          }}
        />
      )}
    </div>
  );
};

export default AccommodationsPage;

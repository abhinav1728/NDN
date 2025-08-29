import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Home, 
  Utensils, 
  Wifi, 
  ArrowRight,
  Star,
  ChevronLeft,
  ChevronRight,
  X
} from 'lucide-react';

const HomePage = () => {
  // Netflix-style gallery state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const features = [
    {
      icon: <Leaf className="h-8 w-8 text-primary-600" />,
      title: "Organic Farm Experience",
      description: "Experience authentic farm life with organic vegetables and fresh produce"
    },
    {
      icon: <Home className="h-8 w-8 text-primary-600" />,
      title: "Comfortable Accommodation",
      description: "Well-appointed rooms with modern amenities in a rustic setting"
    },
    {
      icon: <Utensils className="h-8 w-8 text-primary-600" />,
      title: "Farm-to-Table Dining",
      description: "Delicious meals prepared with fresh ingredients from our own farm"
    },
    {
      icon: <Wifi className="h-8 w-8 text-primary-600" />,
      title: "Modern Amenities",
      description: "Stay connected with Wi-Fi while enjoying the peaceful countryside"
    }
  ];

  const galleryImages = [
    "/assets/IMG-20250817-WA0009.jpg",
    "/assets/IMG-20250817-WA0004.jpg",
    "/assets/IMG-20250817-WA0005.jpg",
    "/assets/IMG-20250817-WA0006.jpg",
    "/assets/IMG-20250817-WA0011.jpg",
    "/assets/IMG-20250817-WA0008.jpg"
  ];

  const accommodations = [
    {
      name: "Standard Room",
      price: "₹2,500",
      image: "/assets/IMG-20250817-WA0009.jpg",
      features: ["Air Conditioning", "Private Bathroom", "Garden View", "Free Wi-Fi"],
      description: "Comfortable rooms with essential amenities for a peaceful stay"
    },
    {
      name: "Deluxe Room",
      price: "₹3,500",
      image: "/assets/IMG-20250817-WA0010.jpg",
      features: ["Premium Furnishing", "Balcony", "Mini Fridge", "Room Service"],
      description: "Spacious rooms with premium amenities and beautiful farm views"
    }
  ];

  // Netflix-style gallery functionality
  const itemsPerSlide = 4;
  const totalSlides = Math.ceil(galleryImages.length / itemsPerSlide);

  // Auto-slide functionality
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => 
        prevSlide === totalSlides - 1 ? 0 : prevSlide + 1
      );
    }, 3000); // 3 seconds auto-slide

    return () => clearInterval(interval);
  }, [totalSlides]);

  const nextSlide = () => {
    setCurrentSlide(currentSlide === totalSlides - 1 ? 0 : currentSlide + 1);
  };

  const prevSlide = () => {
    setCurrentSlide(currentSlide === 0 ? totalSlides - 1 : currentSlide - 1);
  };

  const openImagePopup = (image, index) => {
    setSelectedImage(image);
    setSelectedImageIndex(index);
  };

  const closeImagePopup = () => {
    setSelectedImage(null);
  };

  const nextImageInPopup = () => {
    const nextIndex = selectedImageIndex === galleryImages.length - 1 ? 0 : selectedImageIndex + 1;
    setSelectedImageIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  };

  const prevImageInPopup = () => {
    const prevIndex = selectedImageIndex === 0 ? galleryImages.length - 1 : selectedImageIndex - 1;
    setSelectedImageIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('/assets/IMG-20250817-WA0002.jpg')` }}
        />

        
        <div className="relative z-10 text-center text-white px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 text-shadow-lg animate-fade-in">
            Welcome to Cozy Glory Shed
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-shadow animate-slide-up">
            Experience tranquility at our premium farm-stay retreat near Noida
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Link to="/accommodations" className="btn-primary text-lg px-8 py-3">
              Book Your Stay
            </Link>
            <Link to="/contact" className="btn-outline text-lg px-8 py-3 bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-primary-600">
              Learn More
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow">
          <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Why Choose Cozy Glory Shed?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover the perfect blend of rural charm and modern comfort at our farm retreat
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-6 group-hover:bg-primary-200 transition-colors duration-200">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Netflix-Style Gallery Section */}
      <section id="gallery-section" className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4">
              Gallery
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Explore the natural beauty and peaceful atmosphere of Cozy Glory Shed
            </p>
          </div>

          {/* Netflix-style horizontal scrolling gallery */}
          <div className="relative">
            {/* Navigation Arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-3 rounded-full transition-all duration-200"
            >
              <ChevronRight size={24} />
            </button>

            {/* Image Carousel */}
            <div className="overflow-hidden rounded-lg">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {Array.from({ length: totalSlides }).map((_, slideIndex) => (
                  <div key={slideIndex} className="min-w-full flex space-x-4">
                    {galleryImages
                      .slice(slideIndex * itemsPerSlide, (slideIndex + 1) * itemsPerSlide)
                      .map((image, imageIndex) => {
                        const actualIndex = slideIndex * itemsPerSlide + imageIndex;
                        return (
                          <div
                            key={actualIndex}
                            className="flex-1 relative group cursor-pointer overflow-hidden rounded-lg"
                            onClick={() => openImagePopup(image, actualIndex)}
                          >
                            <img
                              src={image}
                              alt={`Farm view ${actualIndex + 1}`}
                              className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                              <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <span className="text-sm font-medium">Click to view</span>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ))}
              </div>
            </div>

            {/* Slide Indicators */}
            <div className="flex justify-center mt-6 space-x-2">
              {Array.from({ length: totalSlides }).map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-200 ${
                    index === currentSlide 
                      ? 'bg-white' 
                      : 'bg-gray-500 hover:bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Accommodations Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
              Our Accommodations
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose from our comfortable rooms designed for relaxation and rejuvenation
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {accommodations.map((room, index) => (
              <div key={index} className="card group hover:shadow-xl transition-shadow duration-300">
                <div className="relative overflow-hidden">
                  <img
                    src={room.image}
                    alt={room.name}
                    className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                    <span className="text-primary-600 font-semibold">{room.price}/night</span>
                  </div>
                </div>
                
                <div className="p-6">
                  <h3 className="text-2xl font-serif font-semibold text-gray-900 mb-3">
                    {room.name}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {room.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {room.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-2">
                        <Star size={14} className="text-primary-600" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Link 
                    to="/accommodations" 
                    className="w-full btn-primary flex items-center justify-center space-x-2"
                  >
                    <span>Book Now</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/accommodations" className="btn-outline">
              View All Accommodations
            </Link>
          </div>
        </div>
      </section>



      {/* CTA Section */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">
            Ready for Your Farm Retreat?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Book your stay today and experience the perfect blend of nature, comfort, and tranquility
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/accommodations" className="btn-primary text-lg px-8 py-3">
              Book Your Stay
            </Link>
            <Link to="/contact" className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-gray-900">
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* Image Popup Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            {/* Close Button */}
            <button
              onClick={closeImagePopup}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors duration-200"
            >
              <X size={32} />
            </button>
            
            {/* Navigation Arrows */}
            <button
              onClick={prevImageInPopup}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={nextImageInPopup}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all duration-200"
            >
              <ChevronRight size={24} />
            </button>
            
            {/* Main Image */}
            <img
              src={selectedImage}
              alt="Full size view"
              className="max-w-full max-h-[80vh] object-contain rounded-lg"
            />
            
            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
              {selectedImageIndex + 1} / {galleryImages.length}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;

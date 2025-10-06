import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Camera, Image, Award } from 'lucide-react';
import PageBanner from '../components/PageBanner';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const galleryImages = [
    {
      url: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Acne Treatment Results',
      description: 'Complete transformation after 3 months of treatment',
    },
    {
      url: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Skin Rejuvenation',
      description: 'Anti-aging treatment results after 6 weeks',
    },
    {
      url: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Laser Treatment Results',
      description: 'Chemical peel and laser resurfacing combination',
    },
    {
      url: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Hair Restoration',
      description: 'FUE hair transplant results after 12 months',
    },
    {
      url: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clinic',
      title: 'Reception Area',
      description: 'Modern and welcoming clinic entrance',
    },
    {
      url: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clinic',
      title: 'Treatment Room',
      description: 'State-of-the-art treatment facilities',
    },
    {
      url: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clinic',
      title: 'Consultation Room',
      description: 'Private consultation space for patient comfort',
    },
    {
      url: 'https://images.pexels.com/photos/3985319/pexels-photo-3985319.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Anti-Aging Treatment',
      description: 'Botox and filler results after 2 weeks',
    },
    {
      url: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clinic',
      title: 'State-of-the-art Equipment',
      description: 'Advanced laser and treatment technology',
    },
    {
      url: 'https://images.pexels.com/photos/3738388/pexels-photo-3738388.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'PRP Hair Therapy Results',
      description: 'Hair density improvement after 6 months',
    },
    {
      url: 'https://images.pexels.com/photos/4046708/pexels-photo-4046708.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Clear Skin Transformation',
      description: 'Complete acne clearance and scar reduction',
    },
    {
      url: 'https://images.pexels.com/photos/3785706/pexels-photo-3785706.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Pigmentation Treatment',
      description: 'Melasma treatment results after 8 weeks',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Photos', icon: Image },
    { id: 'before-after', label: 'Before & After', icon: Award },
    { id: 'clinic', label: 'Clinic Interior', icon: Camera },
  ];

  const filteredImages = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  const handlePrevious = () => {
    if (selectedImage !== null && selectedImage > 0) {
      setSelectedImage(selectedImage - 1);
    }
  };

  const handleNext = () => {
    if (selectedImage !== null && selectedImage < filteredImages.length - 1) {
      setSelectedImage(selectedImage + 1);
    }
  };

  const stats = [
    { value: '500+', label: 'Success Stories', icon: Award },
    { value: '1000+', label: 'Photos', icon: Image },
    { value: '15+', label: 'Years', icon: Camera },
  ];

  return (
    <div>
      {/* Page Banner */}
      <PageBanner
        title="Our Gallery"
        subtitle="Discover the transformations and experience the excellence of our clinic"
        // icon={Camera}
        gradient="from-blue-600 to-blue-800"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Gallery' },
        ]}
      />

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="card-modern p-6 text-center"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-purple-50 hover:shadow-md'
                }`}
              >
                <category.icon className="w-5 h-5" />
                <span>{category.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence>
              {filteredImages.map((image, index) => (
                <motion.div
                  key={`${activeCategory}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative aspect-square overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl cursor-pointer transform hover:-translate-y-2 transition-all duration-300"
                  onClick={() => setSelectedImage(index)}
                >
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6">
                      <h3 className="text-white font-bold text-lg mb-2">{image.title}</h3>
                      <p className="text-white/90 text-sm">{image.description}</p>
                    </div>
                  </div>
                  {/* Category badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                      image.category === 'before-after' ? 'bg-green-500' : 'bg-blue-500'
                    }`}>
                      {image.category === 'before-after' ? 'Before & After' : 'Clinic'}
                    </span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* Modal */}
      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-6 h-6 text-white" />
            </motion.button>

            {selectedImage > 0 && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </motion.button>
            )}

            {selectedImage < filteredImages.length - 1 && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 z-10 p-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </motion.button>
            )}

            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[selectedImage].url}
                alt={filteredImages[selectedImage].title}
                className="w-full h-auto max-h-[80vh] object-contain rounded-2xl shadow-2xl"
              />
              <div className="text-center mt-6">
                <h3 className="text-white text-2xl font-bold mb-2">{filteredImages[selectedImage].title}</h3>
                <p className="text-white/80 text-lg mb-4">{filteredImages[selectedImage].description}</p>
                <p className="text-white/60 text-sm">
                  {selectedImage + 1} / {filteredImages.length}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

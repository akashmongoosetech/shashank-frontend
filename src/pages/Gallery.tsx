import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Gallery() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');

  const galleryImages = [
    {
      url: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Acne Treatment Results',
    },
    {
      url: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Skin Rejuvenation',
    },
    {
      url: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Laser Treatment Results',
    },
    {
      url: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Hair Restoration',
    },
    {
      url: 'https://images.pexels.com/photos/4173239/pexels-photo-4173239.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clinic',
      title: 'Reception Area',
    },
    {
      url: 'https://images.pexels.com/photos/4386466/pexels-photo-4386466.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clinic',
      title: 'Treatment Room',
    },
    {
      url: 'https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clinic',
      title: 'Consultation Room',
    },
    {
      url: 'https://images.pexels.com/photos/3985319/pexels-photo-3985319.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Anti-Aging Treatment',
    },
    {
      url: 'https://images.pexels.com/photos/5327585/pexels-photo-5327585.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'clinic',
      title: 'State-of-the-art Equipment',
    },
    {
      url: 'https://images.pexels.com/photos/3738388/pexels-photo-3738388.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'PRP Hair Therapy Results',
    },
    {
      url: 'https://images.pexels.com/photos/4046708/pexels-photo-4046708.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Clear Skin Transformation',
    },
    {
      url: 'https://images.pexels.com/photos/3785706/pexels-photo-3785706.jpeg?auto=compress&cs=tinysrgb&w=800',
      category: 'before-after',
      title: 'Pigmentation Treatment',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'before-after', label: 'Before & After' },
    { id: 'clinic', label: 'Clinic Interior' },
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

  return (
    <div>
      <section className="relative bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl font-bold mb-6">Our Gallery</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Discover the transformations and experience the excellence of our clinic
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                  activeCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className="group relative aspect-square overflow-hidden rounded-xl shadow-lg hover:shadow-2xl transition-all cursor-pointer"
                onClick={() => setSelectedImage(index)}
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold">{image.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 text-white hover:bg-white/20 p-2 rounded-full transition-colors z-10"
            >
              <X className="w-8 h-8" />
            </button>

            {selectedImage > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrevious();
                }}
                className="absolute left-4 text-white hover:bg-white/20 p-3 rounded-full transition-colors z-10"
              >
                <ChevronLeft className="w-8 h-8" />
              </button>
            )}

            {selectedImage < filteredImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                className="absolute right-4 text-white hover:bg-white/20 p-3 rounded-full transition-colors z-10"
              >
                <ChevronRight className="w-8 h-8" />
              </button>
            )}

            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={filteredImages[selectedImage].url}
                alt={filteredImages[selectedImage].title}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              <div className="text-center mt-4">
                <p className="text-white text-xl font-semibold">{filteredImages[selectedImage].title}</p>
                <p className="text-gray-400 text-sm mt-1">
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

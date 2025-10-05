import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Heart, Check } from 'lucide-react';

export default function Treatments() {
  const skinTreatments = [
    {
      name: 'Acne Treatment',
      description: 'Advanced solutions for acne and acne scars including chemical peels, laser therapy, and customized skincare',
      benefits: ['Reduces breakouts', 'Minimizes scarring', 'Improves skin texture', 'Boosts confidence'],
      image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Anti-Aging Treatment',
      description: 'Rejuvenate your skin with Botox, dermal fillers, and advanced anti-aging therapies',
      benefits: ['Reduces fine lines', 'Restores volume', 'Tightens skin', 'Natural results'],
      image: 'https://images.pexels.com/photos/3985319/pexels-photo-3985319.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Chemical Peels',
      description: 'Professional-grade peels to exfoliate and reveal fresh, glowing skin',
      benefits: ['Brightens complexion', 'Evens skin tone', 'Reduces pigmentation', 'Smooth texture'],
      image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Pigmentation Treatment',
      description: 'Effective solutions for dark spots, melasma, and uneven skin tone',
      benefits: ['Fades dark spots', 'Even complexion', 'Radiant glow', 'Long-lasting results'],
      image: 'https://images.pexels.com/photos/3785706/pexels-photo-3785706.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  const hairTreatments = [
    {
      name: 'Hair Transplant',
      description: 'FUE and FUT hair transplant procedures for natural-looking, permanent results',
      benefits: ['Natural hairline', 'Permanent solution', 'Minimal scarring', 'High success rate'],
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'PRP Hair Therapy',
      description: 'Platelet-Rich Plasma therapy to stimulate hair growth and strengthen follicles',
      benefits: ['Promotes growth', 'Reduces hair fall', 'Thicker hair', 'Natural treatment'],
      image: 'https://images.pexels.com/photos/3738388/pexels-photo-3738388.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Hair Loss Treatment',
      description: 'Comprehensive solutions including medications, mesotherapy, and scalp treatments',
      benefits: ['Stops hair loss', 'Stimulates regrowth', 'Strengthens roots', 'Personalized plan'],
      image: 'https://images.pexels.com/photos/3997381/pexels-photo-3997381.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Scalp Treatment',
      description: 'Specialized treatments for dandruff, psoriasis, and other scalp conditions',
      benefits: ['Healthy scalp', 'Reduces itching', 'Controls dandruff', 'Balanced pH'],
      image: 'https://images.pexels.com/photos/3764581/pexels-photo-3764581.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  const laserTreatments = [
    {
      name: 'Laser Hair Removal',
      description: 'Permanent hair reduction for face and body using advanced laser technology',
      benefits: ['Permanent results', 'Smooth skin', 'Saves time', 'Precision treatment'],
      image: 'https://images.pexels.com/photos/3865676/pexels-photo-3865676.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Laser Skin Resurfacing',
      description: 'Improve skin texture, reduce scars, and achieve a youthful glow',
      benefits: ['Smoother skin', 'Reduces scars', 'Tightens pores', 'Youthful appearance'],
      image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Laser Tattoo Removal',
      description: 'Safe and effective removal of unwanted tattoos with minimal discomfort',
      benefits: ['Complete removal', 'Minimal scarring', 'Safe procedure', 'Quick sessions'],
      image: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    {
      name: 'Laser Pigmentation Removal',
      description: 'Target and eliminate age spots, sun damage, and hyperpigmentation',
      benefits: ['Clear complexion', 'Even skin tone', 'Quick recovery', 'Visible results'],
      image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
  ];

  const TreatmentCard = ({ treatment, index }: { treatment: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow"
    >
      <div className="relative h-56 overflow-hidden">
        <img
          src={treatment.image}
          alt={treatment.name}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-3">{treatment.name}</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">{treatment.description}</p>
        <div className="space-y-2 mb-6">
          {treatment.benefits.map((benefit: string, idx: number) => (
            <div key={idx} className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
              <span className="text-gray-700 text-sm">{benefit}</span>
            </div>
          ))}
        </div>
        <Link
          to="/book-appointment"
          className="block w-full text-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
        >
          Book Now
        </Link>
      </div>
    </motion.div>
  );

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
            <h1 className="text-5xl font-bold mb-6">Our Treatments</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Comprehensive skin, hair, and laser treatments designed to help you look and feel your best
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-12">
            <Sparkles className="w-12 h-12 text-blue-600 mr-4" />
            <h2 className="text-4xl font-bold text-gray-900">Skin Treatments</h2>
          </div>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Advanced dermatological solutions for all your skin concerns
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skinTreatments.map((treatment, index) => (
              <TreatmentCard key={index} treatment={treatment} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-12">
            <Heart className="w-12 h-12 text-blue-600 mr-4" />
            <h2 className="text-4xl font-bold text-gray-900">Hair Treatments</h2>
          </div>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            Restore confidence with our comprehensive hair restoration solutions
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {hairTreatments.map((treatment, index) => (
              <TreatmentCard key={index} treatment={treatment} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center mb-12">
            <Zap className="w-12 h-12 text-blue-600 mr-4" />
            <h2 className="text-4xl font-bold text-gray-900">Laser Treatments</h2>
          </div>
          <p className="text-xl text-gray-600 text-center mb-12 max-w-3xl mx-auto">
            State-of-the-art laser technology for safe, effective results
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {laserTreatments.map((treatment, index) => (
              <TreatmentCard key={index} treatment={treatment} index={index} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Not Sure Which Treatment is Right for You?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Schedule a consultation and let our experts create a personalized treatment plan
          </p>
          <Link
            to="/book-appointment"
            className="inline-block px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold text-lg"
          >
            Book a Consultation
          </Link>
        </div>
      </section>
    </div>
  );
}

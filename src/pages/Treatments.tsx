import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Zap, Heart, Check, ArrowRight, Star } from 'lucide-react';
import PageBanner from '../components/PageBanner';

export default function Treatments() {
  const skinTreatments = [
    {
      name: 'Acne Treatment',
      description: 'Advanced solutions for acne and acne scars including chemical peels, laser therapy, and customized skincare',
      benefits: ['Reduces breakouts', 'Minimizes scarring', 'Improves skin texture', 'Boosts confidence'],
      image: 'https://images.pexels.com/photos/3762879/pexels-photo-3762879.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Sparkles,
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Anti-Aging Treatment',
      description: 'Rejuvenate your skin with Botox, dermal fillers, and advanced anti-aging therapies',
      benefits: ['Reduces fine lines', 'Restores volume', 'Tightens skin', 'Natural results'],
      image: 'https://images.pexels.com/photos/3985319/pexels-photo-3985319.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Heart,
      color: 'from-blue-600 to-blue-700',
    },
    {
      name: 'Chemical Peels',
      description: 'Professional-grade peels to exfoliate and reveal fresh, glowing skin',
      benefits: ['Brightens complexion', 'Evens skin tone', 'Reduces pigmentation', 'Smooth texture'],
      image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Star,
      color: 'from-blue-700 to-blue-800',
    },
    {
      name: 'Pigmentation Treatment',
      description: 'Effective solutions for dark spots, melasma, and uneven skin tone',
      benefits: ['Fades dark spots', 'Even complexion', 'Radiant glow', 'Long-lasting results'],
      image: 'https://images.pexels.com/photos/3785706/pexels-photo-3785706.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Zap,
      color: 'from-blue-400 to-blue-500',
    },
  ];

  const hairTreatments = [
    {
      name: 'Hair Transplant',
      description: 'FUE and FUT hair transplant procedures for natural-looking, permanent results',
      benefits: ['Natural hairline', 'Permanent solution', 'Minimal scarring', 'High success rate'],
      image: 'https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Sparkles,
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'PRP Hair Therapy',
      description: 'Platelet-Rich Plasma therapy to stimulate hair growth and strengthen follicles',
      benefits: ['Promotes growth', 'Reduces hair fall', 'Thicker hair', 'Natural treatment'],
      image: 'https://images.pexels.com/photos/3738388/pexels-photo-3738388.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Heart,
      color: 'from-blue-600 to-blue-700',
    },
    {
      name: 'Hair Loss Treatment',
      description: 'Comprehensive solutions including medications, mesotherapy, and scalp treatments',
      benefits: ['Stops hair loss', 'Stimulates regrowth', 'Strengthens roots', 'Personalized plan'],
      image: 'https://images.pexels.com/photos/3997381/pexels-photo-3997381.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Star,
      color: 'from-blue-700 to-blue-800',
    },
    {
      name: 'Scalp Treatment',
      description: 'Specialized treatments for dandruff, psoriasis, and other scalp conditions',
      benefits: ['Healthy scalp', 'Reduces itching', 'Controls dandruff', 'Balanced pH'],
      image: 'https://images.pexels.com/photos/3764581/pexels-photo-3764581.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Zap,
      color: 'from-blue-400 to-blue-500',
    },
  ];

  const laserTreatments = [
    {
      name: 'Laser Hair Removal',
      description: 'Permanent hair reduction for face and body using advanced laser technology',
      benefits: ['Permanent results', 'Smooth skin', 'Saves time', 'Precision treatment'],
      image: 'https://images.pexels.com/photos/3865676/pexels-photo-3865676.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Sparkles,
      color: 'from-blue-500 to-blue-600',
    },
    {
      name: 'Laser Skin Resurfacing',
      description: 'Improve skin texture, reduce scars, and achieve a youthful glow',
      benefits: ['Smoother skin', 'Reduces scars', 'Tightens pores', 'Youthful appearance'],
      image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Heart,
      color: 'from-blue-600 to-blue-700',
    },
    {
      name: 'Laser Tattoo Removal',
      description: 'Safe and effective removal of unwanted tattoos with minimal discomfort',
      benefits: ['Complete removal', 'Minimal scarring', 'Safe procedure', 'Quick sessions'],
      image: 'https://images.pexels.com/photos/3762800/pexels-photo-3762800.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Star,
      color: 'from-blue-700 to-blue-800',
    },
    {
      name: 'Laser Pigmentation Removal',
      description: 'Target and eliminate age spots, sun damage, and hyperpigmentation',
      benefits: ['Clear complexion', 'Even skin tone', 'Quick recovery', 'Visible results'],
      image: 'https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=600',
      icon: Zap,
      color: 'from-blue-400 to-blue-500',
    },
  ];

  const TreatmentCard = ({ treatment, index }: { treatment: any; index: number }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className="group"
    >
      <div className="card-modern overflow-hidden">
        <div className="relative h-64 overflow-hidden">
          <img
            src={treatment.image}
            alt={treatment.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

          {/* Icon badge */}
          <div className={`absolute top-4 right-4 p-3 bg-gradient-to-r ${treatment.color} rounded-xl shadow-lg`}>
            <treatment.icon className="w-6 h-6 text-white" />
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h3 className="text-2xl font-bold text-white mb-2">
              {treatment.name}
            </h3>
          </div>
        </div>
        <div className="p-6">
          <p className="text-gray-600 mb-6 leading-relaxed">{treatment.description}</p>
          <div className="space-y-3 mb-6">
            {treatment.benefits.map((benefit: string, idx: number) => (
              <div key={idx} className="flex items-center space-x-3">
                <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                <span className="text-gray-700">{benefit}</span>
              </div>
            ))}
          </div>
          <Link
            to="/book-appointment"
            className="inline-flex items-center justify-center w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300"
          >
            Book Now
            <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </div>
    </motion.div>
  );

  const TreatmentSection = ({ title, icon: Icon, treatments, index }: { title: string; icon: any; treatments: any[]; index: number }) => (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl mb-6">
            <Icon className="w-10 h-10 text-white" />
          </div>
          <h2 className="section-title">
            {title}
          </h2>
          <p className="section-subtitle">
            {title === 'Skin Treatments' && 'Advanced dermatological solutions for all your skin concerns'}
            {title === 'Hair Treatments' && 'Restore confidence with our comprehensive hair restoration solutions'}
            {title === 'Laser Treatments' && 'State-of-the-art laser technology for safe, effective results'}
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {treatments.map((treatment, idx) => (
            <TreatmentCard key={idx} treatment={treatment} index={idx} />
          ))}
        </div>
      </div>
    </section>
  );

  return (
    <div>
      {/* Page Banner */}
      <PageBanner
        title="Our Treatments"
        subtitle="Comprehensive skin, hair, and laser treatments designed to help you look and feel your best"
        // icon={Sparkles}
        gradient="from-blue-600 to-blue-800"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'Treatments' },
        ]}
      />

      {/* Skin Treatments */}
      <TreatmentSection title="Skin Treatments" icon={Sparkles} treatments={skinTreatments} index={0} />

      {/* Hair Treatments */}
      <TreatmentSection title="Hair Treatments" icon={Heart} treatments={hairTreatments} index={1} />

      {/* Laser Treatments */}
      <TreatmentSection title="Laser Treatments" icon={Zap} treatments={laserTreatments} index={2} />

      {/* CTA Section */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-800"></div>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full filter blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6">
              <Star className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Not Sure Which Treatment is Right for You?
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Schedule a consultation and let our experts create a personalized treatment plan
            </p>
            <Link
              to="/book-appointment"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg transform hover:-translate-y-1"
            >
              Book a Consultation
              <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

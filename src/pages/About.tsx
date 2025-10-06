import { motion } from 'framer-motion';
import { Award, Users, Heart, Target, GraduationCap, Briefcase, Sparkles, TrendingUp, Shield, CheckCircle } from 'lucide-react';
import PageBanner from '../components/PageBanner';

export default function About() {
  const qualifications = [
    'MBBS, MD (Dermatology)',
    'Board Certified Dermatologist',
    'Fellowship in Cosmetic Dermatology',
    'Member of American Academy of Dermatology',
  ];

  const values = [
    {
      icon: Heart,
      title: 'Patient-Centered Care',
      description: 'Your comfort and satisfaction are our top priorities',
      color: 'from-blue-400 to-blue-500',
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality treatments',
      color: 'from-blue-500 to-blue-600',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building lasting relationships with our patients',
      color: 'from-blue-600 to-blue-700',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Using the latest technology and techniques',
      color: 'from-blue-700 to-blue-800',
    },
  ];

  const achievements = [
    { 
      year: '2010', 
      title: 'Clinic Established', 
      description: 'Opened Bhargava Clinic with a vision to provide world-class dermatological care',
      icon: Sparkles,
    },
    { 
      year: '2015', 
      title: 'Excellence Award', 
      description: 'Recognized as the Best Dermatology Clinic in the Region',
      icon: Award,
    },
    { 
      year: '2018', 
      title: 'Advanced Technology', 
      description: 'Introduced state-of-the-art laser equipment and treatment facilities',
      icon: TrendingUp,
    },
    { 
      year: '2023', 
      title: '10,000+ Patients', 
      description: 'Achieved milestone of successfully treating over 10,000 satisfied patients',
      icon: Users,
    },
  ];

  const stats = [
    { value: '15+', label: 'Years Experience', icon: Award },
    { value: '10,000+', label: 'Happy Patients', icon: Users },
    { value: '50+', label: 'Treatments', icon: Sparkles },
    { value: '100%', label: 'Satisfaction', icon: Heart },
  ];

  return (
    <div>
      {/* Page Banner */}
      <PageBanner
        title="About Bhargava Clinic"
        subtitle="Dedicated to providing exceptional dermatological care with compassion and expertise"
        // icon={Heart}
        gradient="from-blue-600 to-blue-800"
        breadcrumbs={[
          { label: 'Home', path: '/' },
          { label: 'About' },
        ]}
      />

      {/* Stats Section */}
      <section className="py-16 bg-white relative -mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
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

      {/* Doctor Profile Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl blur-2xl opacity-20"></div>
                <img
                  src="./images/dr.png"
                  alt="Dr. Shashank Bhargava"
                  className="relative rounded-3xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-2xl shadow-2xl">
                  <p className="text-4xl font-bold">15+</p>
                  <p className="text-sm font-semibold">Years Experience</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Meet Dr. <span className="text-gradient">Shashank Bhargava</span>
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Dr. Shashank Bhargava is a board-certified dermatologist with over 15 years of experience
                in treating various skin and hair conditions. He founded Bhargava Clinic with a
                vision to provide world-class dermatological care that is accessible, affordable,
                and patient-centered.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Dr. Bhargava completed his medical degree from Harvard Medical School and specialized
                in dermatology at Johns Hopkins Hospital. He has a special interest in cosmetic
                dermatology and has helped thousands of patients achieve their skin goals.
              </p>

              <div className="bg-white p-6 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <GraduationCap className="w-6 h-6 text-blue-600" />
                  </div>
                  <span className="text-gray-900 font-bold text-lg">Education & Qualifications</span>
                </div>
                <div className="space-y-3">
                  {qualifications.map((qual, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{qual}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Values Section */}
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">
              Our Mission & <span className="text-gradient">Values</span>
            </h2>
            <p className="section-subtitle">
              We are committed to transforming lives through exceptional dermatological care
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group"
              >
                <div className="card-modern p-8 text-center h-full">
                  <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${value.color} rounded-2xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                    <value.icon className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey Timeline Section */}
      <section className="section-padding bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="section-title">
              Our <span className="text-gradient">Journey</span>
            </h2>
            <p className="section-subtitle">Milestones in our commitment to excellence</p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 to-blue-600 hidden lg:block"></div>

            <div className="space-y-12">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${
                    index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                  }`}>
                    <div className={index % 2 === 0 ? 'lg:text-right' : 'lg:col-start-2'}>
                      <div className="card-modern p-8 inline-block">
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`p-3 bg-gradient-to-r ${
                            index % 2 === 0 ? 'from-blue-500 to-blue-600' : 'from-blue-600 to-blue-700'
                          } rounded-xl`}>
                            <achievement.icon className="w-6 h-6 text-white" />
                          </div>
                          <span className="inline-block bg-gradient-to-r from-blue-600 to-blue-800 text-white px-6 py-2 rounded-full font-bold">
                            {achievement.year}
                          </span>
                        </div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">{achievement.title}</h3>
                        <p className="text-gray-600 leading-relaxed">{achievement.description}</p>
                      </div>
                    </div>
                    <div className="hidden lg:block"></div>
                  </div>

                  {/* Timeline dot */}
                  <div className="hidden lg:block absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-white border-4 border-blue-600 rounded-full shadow-lg"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

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
              <Briefcase className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Join Our Growing Family
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Experience the difference that personalized, expert care can make in your skin health journey.
              We look forward to welcoming you to our clinic.
            </p>
            <a
              href="/book-appointment"
              className="inline-flex items-center px-8 py-4 bg-white text-blue-600 rounded-xl hover:shadow-2xl transition-all duration-300 font-semibold text-lg transform hover:-translate-y-1"
            >
              Book Your Appointment
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

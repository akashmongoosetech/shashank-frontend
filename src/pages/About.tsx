import { motion } from 'framer-motion';
import { Award, Users, Heart, Target, GraduationCap, Briefcase } from 'lucide-react';

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
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'Committed to delivering the highest quality treatments',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Building lasting relationships with our patients',
    },
    {
      icon: Target,
      title: 'Innovation',
      description: 'Using the latest technology and techniques',
    },
  ];

  const achievements = [
    { year: '2010', title: 'Clinic Established', description: 'Opened Bhargava Clinic' },
    { year: '2015', title: 'Excellence Award', description: 'Best Dermatology Clinic in Region' },
    { year: '2018', title: 'Advanced Technology', description: 'Introduced state-of-the-art laser equipment' },
    { year: '2023', title: '10,000+ Patients', description: 'Milestone of successfully treated patients' },
  ];

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
            <h1 className="text-5xl font-bold mb-6">About Bhargava Clinic</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Dedicated to providing exceptional dermatological care with compassion and expertise
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="relative">
                <img
                  src="./images/dr.png"
                  alt="Dr. Sarah Johnson"
                  className="rounded-2xl shadow-2xl w-full"
                />
                <div className="absolute -bottom-6 -right-6 bg-blue-600 text-white p-6 rounded-xl shadow-xl">
                  <p className="text-3xl font-bold">15+</p>
                  <p className="text-sm">Years Experience</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Meet Dr. Shashank Bhargava</h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Dr. Shashank Bhargava is a board-certified dermatologist with over 15 years of experience
                in treating various skin and hair conditions. She founded Bhargava Clinic with a
                vision to provide world-class dermatological care that is accessible, affordable,
                and patient-centered.
              </p>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                Dr. Shashank Bhargava completed her medical degree from Harvard Medical School and specialized
                in dermatology at Johns Hopkins Hospital. She has a special interest in cosmetic
                dermatology and has helped thousands of patients achieve their skin goals.
              </p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                  <span className="text-gray-700 font-semibold">Education & Qualifications</span>
                </div>
                {qualifications.map((qual, index) => (
                  <div key={index} className="flex items-center space-x-3 ml-9">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span className="text-gray-600">{qual}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Mission & Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We are committed to transforming lives through exceptional dermatological care
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Journey</h2>
            <p className="text-xl text-gray-600">Milestones in our commitment to excellence</p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-blue-200 hidden lg:block"></div>

            <div className="space-y-12">
              {achievements.map((achievement, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`relative grid grid-cols-1 lg:grid-cols-2 gap-8 ${
                    index % 2 === 0 ? '' : 'lg:flex-row-reverse'
                  }`}
                >
                  <div className={index % 2 === 0 ? 'lg:text-right' : 'lg:col-start-2'}>
                    <div className="inline-block bg-blue-600 text-white px-6 py-2 rounded-full font-bold mb-4">
                      {achievement.year}
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{achievement.title}</h3>
                    <p className="text-gray-600">{achievement.description}</p>
                  </div>
                  <div className="hidden lg:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Briefcase className="w-16 h-16 mx-auto mb-6 text-blue-200" />
          <h2 className="text-4xl font-bold mb-6">Join Our Growing Family</h2>
          <p className="text-xl text-blue-100 mb-8 leading-relaxed">
            Experience the difference that personalized, expert care can make in your skin health journey.
            We look forward to welcoming you to our clinic.
          </p>
        </div>
      </section>
    </div>
  );
}

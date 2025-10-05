import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function Blog() {
  const blogPosts = [
    {
      id: '1',
      title: '10 Essential Skincare Tips for Healthy Glowing Skin',
      slug: '10-essential-skincare-tips',
      excerpt: 'Discover the top 10 skincare tips that will help you achieve and maintain healthy, glowing skin all year round.',
      image: 'https://images.pexels.com/photos/3852159/pexels-photo-3852159.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: 'Dr. Derma',
      date: 'March 15, 2024',
    },
    {
      id: '2',
      title: 'Understanding Acne: Causes and Effective Treatments',
      slug: 'understanding-acne-causes-treatments',
      excerpt: 'Learn about the root causes of acne and discover the most effective treatment options available at our clinic.',
      image: 'https://images.pexels.com/photos/4046708/pexels-photo-4046708.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: 'Dr. Derma',
      date: 'March 10, 2024',
    },
    {
      id: '3',
      title: 'The Benefits of Laser Hair Removal',
      slug: 'benefits-laser-hair-removal',
      excerpt: 'Laser hair removal is a safe and effective way to achieve smooth, hair-free skin. Learn about its benefits and what to expect.',
      image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: 'Dr. Derma',
      date: 'March 5, 2024',
    },
    {
      id: '4',
      title: 'Anti-Aging Skincare: How to Keep Your Skin Youthful',
      slug: 'anti-aging-skincare-tips',
      excerpt: 'Discover effective anti-aging strategies and treatments that can help you maintain youthful, radiant skin at any age.',
      image: 'https://images.pexels.com/photos/3985319/pexels-photo-3985319.jpeg?auto=compress&cs=tinysrgb&w=800',
      author: 'Dr. Derma',
      date: 'February 28, 2024',
    },
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
            <h1 className="text-5xl font-bold mb-6">Our Blog</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Expert insights and tips for healthy skin and hair care
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow group"
              >
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </div>

                <div className="p-6">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>{post.author}</span>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                    {post.title}
                  </h2>

                  <p className="text-gray-600 mb-4 leading-relaxed">{post.excerpt}</p>

                  <Link
                    to={`/blog/${post.slug}`}
                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 group"
                  >
                    Read More
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

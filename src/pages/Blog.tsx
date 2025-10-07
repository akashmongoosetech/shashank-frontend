import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  User,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Heart,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import PageBanner from "../components/PageBanner";
import { getBlogs, type Blog } from "../services/apiService";

export default function Blog() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await getBlogs({ status: "published", limit: 12 });
        if (res.success && res.data) {
          setBlogs(res.data.blogs);
        } else {
          setError(res.message || "Failed to load blogs");
        }
      } catch (e: any) {
        setError(e?.message || "Failed to load blogs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const categories = [
    { name: "All", count: 12 },
    { name: "Skincare", count: 5 },
    { name: "Hair Care", count: 3 },
    { name: "Laser", count: 2 },
    { name: "Anti-Aging", count: 2 },
  ];

  const stats = [
    { value: "50+", label: "Articles Published", icon: BookOpen },
    { value: "10K+", label: "Monthly Readers", icon: TrendingUp },
    { value: "4.8/5", label: "Content Rating", icon: Heart },
  ];

  // Slider logic
  const blogsPerSlide = 3;
  const totalSlides = Math.ceil(blogs.length / blogsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <div>
      {/* Page Banner */}
      <PageBanner
        title="Our Blog"
        subtitle="Expert insights and tips for healthy skin and hair care"
        // icon={BookOpen}
        gradient="from-blue-600 to-blue-800"
        breadcrumbs={[{ label: "Home", path: "/" }, { label: "Blog" }]}
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
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-700 rounded-2xl mb-4">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-2">
                  {stat.value}
                </p>
                <p className="text-gray-600 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Filter */}
      {/* <section className="py-12 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category, index) => (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${
                  index === 0
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-blue-50 hover:shadow-md'
                }`}
              >
                <span>{category.name}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  index === 0 ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'
                }`}>
                  {category.count}
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section> */}

      {/* Blog Posts Slider */}
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
              Latest <span className="text-gradient">Articles</span>
            </h2>
            <p className="section-subtitle">
              Stay informed with expert advice and the latest trends in
              dermatology
            </p>
          </motion.div>

          {loading && (
            <div className="text-center text-gray-600">Loading blogs...</div>
          )}
          {error && <div className="text-center text-red-600">{error}</div>}

          {!loading && !error && blogs.length > 0 && (
            <div className="relative">
              {/* Slider Container */}
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-500 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                  {Array.from({ length: totalSlides }, (_, slideIndex) => (
                    <div key={slideIndex} className="flex-none w-full mb-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
                        {blogs
                          .slice(
                            slideIndex * blogsPerSlide,
                            (slideIndex + 1) * blogsPerSlide
                          )
                          .map((post, index) => (
                            <motion.article
                              key={post._id}
                              initial={{ opacity: 0, y: 20 }}
                              whileInView={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: index * 0.1 }}
                              viewport={{ once: true }}
                              className="group"
                            >
                              <div className="card-modern overflow-hidden">
                                <div className="relative h-64 overflow-hidden">
                                  <img
                                    src={
                                      post.image ||
                                      (post.sections &&
                                        post.sections[0]?.image) ||
                                      ""
                                    }
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>

                                  {/* Category badge */}
                                  <div className="absolute top-4 left-4">
                                    <span
                                      className={`px-3 py-1 rounded-full text-xs font-semibold text-white bg-blue-600/80`}
                                    >
                                      {post.category || "General"}
                                    </span>
                                  </div>

                                  {/* Icon badge */}
                                  <div
                                    className={`absolute top-4 right-4 p-3 bg-blue-600 rounded-xl shadow-lg`}
                                  >
                                    <BookOpen className="w-6 h-6 text-white" />
                                  </div>
                                </div>

                                <div className="p-6">
                                  <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                                    <div className="flex items-center space-x-1">
                                      <Calendar className="w-4 h-4" />
                                      <span>
                                        {post.publishedAt
                                          ? new Date(
                                              post.publishedAt
                                            ).toLocaleDateString()
                                          : ""}
                                      </span>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                      <User className="w-4 h-4" />
                                      <span>
                                        {post.author || "Clinic Team"}
                                      </span>
                                    </div>
                                    {post.readTime && (
                                      <span className="text-blue-600 font-medium">
                                        {post.readTime}
                                      </span>
                                    )}
                                  </div>

                                  <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                                    {post.title}
                                  </h2>

                                  <p
                                    className="text-gray-600 mb-4 leading-relaxed"
                                    style={{
                                      display: "-webkit-box",
                                      WebkitLineClamp: 3,
                                      WebkitBoxOrient: "vertical",
                                      overflow: "hidden",
                                    }}
                                  >
                                    {post.excerpt}
                                  </p>

                                  <Link
                                    to={`/blog/${post.slug}`}
                                    className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-400 group/link transition-colors"
                                  >
                                    Read More
                                    <ArrowRight className="ml-2 w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
                                  </Link>
                                </div>
                              </div>
                            </motion.article>
                          ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Buttons */}
              {totalSlides > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white shadow-lg hover:shadow-xl rounded-full p-3 text-blue-600 hover:text-blue-700 transition-all duration-300 z-10"
                    aria-label="Previous slide"
                  >
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white shadow-lg hover:shadow-xl rounded-full p-3 text-blue-600 hover:text-blue-700 transition-all duration-300 z-10"
                    aria-label="Next slide"
                  >
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>
              )}

              {/* Dots Indicator */}
              {totalSlides > 1 && (
                <div className="flex justify-center space-x-2 mt-8">
                  {Array.from({ length: totalSlides }, (_, index) => (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-blue-600 scale-125"
                          : "bg-gray-300 hover:bg-gray-400"
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {!loading && !error && blogs.length === 0 && (
            <div className="text-center text-gray-500 py-12">
              {/* No blog posts available at the moment. */}
              <img src="./images/blog-not-found.png" alt="blog-not-found" className="w-100 mx-auto " />
            </div>
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="section-padding relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-600"></div>
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
              <BookOpen className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Stay Updated with Our Latest Articles
            </h2>
            <p className="text-xl text-white/90 mb-10 leading-relaxed">
              Subscribe to our newsletter and get expert skincare tips delivered
              to your inbox
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 max-w-md px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder-white/70 focus:outline-none focus:border-white/40 transition-colors"
              />
              <button className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 whitespace-nowrap">
                Subscribe Now
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

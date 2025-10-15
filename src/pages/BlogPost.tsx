import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Calendar, User, ArrowLeft, Clock } from "lucide-react";
import { getBlogBySlug, getBlogs, type Blog } from "../services/apiService";

export default function BlogPost() {
   const { slug } = useParams();
   const [post, setPost] = useState<Blog | null>(null);
   const [loading, setLoading] = useState<boolean>(true);
   const [error, setError] = useState<string | null>(null);
   const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
   const [relatedLoading, setRelatedLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      if (!slug) return;
      try {
        const res = await getBlogBySlug(slug);
        if (res.success && res.data) {
          setPost(res.data);
          // Fetch related blogs based on category
          if (res.data.category) {
            setRelatedLoading(true);
            const relatedRes = await getBlogs({
              category: res.data.category,
              limit: 3,
              status: 'published'
            });
            if (relatedRes.success && relatedRes.data) {
              // Filter out current blog and limit to 3
              const filtered = relatedRes.data.blogs
                .filter(blog => blog._id !== res.data!._id)
                .slice(0, 3);
              setRelatedBlogs(filtered);
            }
            setRelatedLoading(false);
          }
        } else {
          setError(res.message || "Blog not found");
        }
      } catch (e: unknown) {
        const error = e as Error;
        setError(error?.message || "Failed to load blog");
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-600">
        Loading...
      </div>
    );
  }

  if (!post || error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {error || "Blog Post Not Found"}
          </h2>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  const metaTags =
    post.metaTags?.map((tag) => {
      const parts = tag.split(",");
      const attrs: Record<string, string> = {};
      parts.forEach((part) => {
        const [key, value] = part.split("=");
        if (key && value) attrs[key.trim()] = value.trim();
      });
      return attrs;
    }) || [];

  return (
    <div>
      <Helmet>
        <title>{post.title} | Clinic Blog</title>
        <meta
          name="description"
          content={post.metaDescription || post.excerpt}
        />
        {post.seoKeywords && post.seoKeywords.length > 0 && (
          <meta name="keywords" content={post.seoKeywords.join(", ")} />
        )}
        {metaTags.map((tag, index) => (
          <meta key={index} {...tag} />
        ))}
        <meta property="og:title" content={post.title} />
        <meta
          property="og:description"
          content={post.metaDescription || post.excerpt}
        />
        <meta
          property="og:image"
          content={
            post.image || (post.sections && post.sections[0]?.image) || ""
          }
        />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta
          name="twitter:description"
          content={post.metaDescription || post.excerpt}
        />
        <meta
          name="twitter:image"
          content={
            post.image || (post.sections && post.sections[0]?.image) || ""
          }
        />
      </Helmet>
      <section className="relative h-96 overflow-hidden">
        <img
          src={post.image || (post.sections && post.sections[0]?.image) || ""}
          alt={post.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="max-w-4xl mx-auto px-4 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
            >
              {post.title}
            </motion.h1>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center space-x-6 text-white"
            >
              <div className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>
                  {post.publishedAt
                    ? new Date(post.publishedAt).toLocaleDateString()
                    : ""}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{post.author || "Clinic Team"}</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            to="/blog"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Blog
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold leading-tight text-gray-900 dark:text-white mb-6"
          >
            {post.title}
          </motion.h1>

          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-10"
          >
            <div
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </motion.section>

          {post.sections && post.sections.length > 0 ? (
            <div className="space-y-10">
              {post.sections.map((s, i) => (
                <motion.section
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  {s.title && (
                    <h2 className="text-2xl font-bold mb-3">{s.title}</h2>
                  )}
                  {s.image && (
                    <img
                      src={s.image}
                      alt={s.title || `Section ${i + 1}`}
                      className="w-full rounded-lg mb-4"
                    />
                  )}
                  <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: s.content }}
                  />
                </motion.section>
              ))}
            </div>
          ) : (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          )}

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Improve Your Skin?
              </h3>
              <p className="text-gray-700 mb-6">
                Schedule a consultation with our expert dermatologists to create
                a personalized treatment plan.
              </p>
              <Link
                to="/book-appointment"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Related Blogs Section */}
      {relatedBlogs.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                More Articles You May Like
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover more insights and tips related to {post.category || 'skin care'}
              </p>
            </motion.div>

            {relatedLoading ? (
              <div className="flex justify-center">
                <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedBlogs.map((blog, index) => (
                  <motion.article
                    key={blog._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
                  >
                    <Link to={`/blog/${blog.slug}`} className="block">
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={blog.image || (blog.sections && blog.sections[0]?.image) || ""}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <span>
                              {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          {blog.readTime && (
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{blog.readTime}</span>
                            </div>
                          )}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 line-clamp-3">
                          {blog.excerpt}
                        </p>
                        <div className="flex items-center justify-between pt-2">
                          <span className="text-sm text-gray-500">
                            By {blog.author || 'Clinic Team'}
                          </span>
                          <span className="text-blue-600 group-hover:text-blue-700 font-medium text-sm transition-colors duration-200">
                            Read More →
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

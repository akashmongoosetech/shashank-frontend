import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, User, ArrowLeft } from 'lucide-react';

export default function BlogPost() {
  const { slug } = useParams();

  const blogPosts: Record<string, any> = {
    '10-essential-skincare-tips': {
      title: '10 Essential Skincare Tips for Healthy Glowing Skin',
      image: 'https://images.pexels.com/photos/3852159/pexels-photo-3852159.jpeg?auto=compress&cs=tinysrgb&w=1200',
      author: 'Dr. Derma',
      date: 'March 15, 2024',
      content: `
        <h2>Introduction</h2>
        <p>Achieving healthy, glowing skin is not just about using the right products—it is about following a consistent skincare routine and making smart lifestyle choices. Here are 10 essential tips to help you get the skin you have always wanted.</p>

        <h2>1. Cleanse Daily</h2>
        <p>Always cleanse your face twice a day to remove dirt, oil, and makeup. Use a gentle cleanser that suits your skin type. Morning cleansing removes oils that accumulate overnight, while evening cleansing removes the day's buildup of pollutants and makeup.</p>

        <h2>2. Stay Hydrated</h2>
        <p>Drink at least 8 glasses of water daily to keep your skin hydrated from within. Proper hydration helps maintain skin elasticity and flushes out toxins that can lead to breakouts and dullness.</p>

        <h2>3. Use Sunscreen</h2>
        <p>Apply broad-spectrum SPF 30+ sunscreen every day, even on cloudy days, to protect against UV damage. Sun damage is the leading cause of premature aging, including wrinkles, age spots, and loss of elasticity.</p>

        <h2>4. Moisturize Regularly</h2>
        <p>Keep your skin moisturized to maintain its natural barrier and prevent dryness. Choose a moisturizer appropriate for your skin type—lightweight lotions for oily skin and richer creams for dry skin.</p>

        <h2>5. Eat a Balanced Diet</h2>
        <p>Include fruits, vegetables, and omega-3 fatty acids in your diet for healthy skin. Foods rich in antioxidants, vitamins, and healthy fats support skin health from the inside out.</p>

        <h2>6. Get Enough Sleep</h2>
        <p>Aim for 7-8 hours of quality sleep to allow your skin to repair and regenerate. During sleep, your body increases blood flow to the skin and rebuilds collagen, helping to reverse UV damage.</p>

        <h2>7. Avoid Touching Your Face</h2>
        <p>Keep your hands away from your face to prevent transferring bacteria and oils. This simple habit can significantly reduce breakouts and skin irritation.</p>

        <h2>8. Exfoliate Weekly</h2>
        <p>Exfoliate 1-2 times per week to remove dead skin cells and reveal fresh skin. Regular exfoliation improves skin texture, unclogs pores, and allows better absorption of skincare products.</p>

        <h2>9. Manage Stress</h2>
        <p>Practice stress-reduction techniques like meditation and yoga for better skin health. Chronic stress can trigger inflammation and breakouts, so managing stress is crucial for clear skin.</p>

        <h2>10. Visit a Dermatologist</h2>
        <p>Regular checkups with a dermatologist can help address skin concerns early and maintain optimal skin health. Professional guidance ensures you're using the right products and treatments for your specific skin needs.</p>

        <h2>Conclusion</h2>
        <p>Following these essential skincare tips will set you on the path to healthier, more radiant skin. Remember, consistency is key, and results take time. If you have specific skin concerns, schedule a consultation with us to create a personalized treatment plan.</p>
      `,
    },
    'understanding-acne-causes-treatments': {
      title: 'Understanding Acne: Causes and Effective Treatments',
      image: 'https://images.pexels.com/photos/4046708/pexels-photo-4046708.jpeg?auto=compress&cs=tinysrgb&w=1200',
      author: 'Dr. Derma',
      date: 'March 10, 2024',
      content: `
        <h2>What Causes Acne?</h2>
        <p>Acne is a common skin condition that affects millions of people worldwide. It occurs when hair follicles become clogged with oil and dead skin cells, leading to pimples, blackheads, and whiteheads.</p>

        <h2>Common Causes</h2>
        <ul>
          <li>Hormonal changes during puberty, pregnancy, or menstruation</li>
          <li>Excess oil production</li>
          <li>Bacteria buildup (Cutibacterium acnes)</li>
          <li>Certain medications</li>
          <li>Diet and stress factors</li>
        </ul>

        <h2>Treatment Options</h2>
        <p>At Bhargava Clinic, we offer a range of effective acne treatments:</p>

        <h3>Topical Treatments</h3>
        <p>We prescribe medical-grade retinoids, benzoyl peroxide, and salicylic acid formulations that target acne at its source. These treatments help unclog pores, reduce inflammation, and prevent new breakouts.</p>

        <h3>Oral Medications</h3>
        <p>For moderate to severe acne, oral antibiotics or hormonal therapy may be recommended. These medications work from within to reduce bacteria and balance hormones that trigger breakouts.</p>

        <h3>Chemical Peels</h3>
        <p>Professional chemical peels exfoliate the skin, unclog pores, and reduce acne scarring. Our customized peels are tailored to your skin type and acne severity.</p>

        <h3>Laser Therapy</h3>
        <p>Advanced laser treatments reduce inflammation, kill acne-causing bacteria, and promote skin healing. Laser therapy is particularly effective for cystic acne and acne scarring.</p>

        <h2>Prevention Tips</h2>
        <p>Maintain a consistent skincare routine with gentle, non-comedogenic products. Avoid touching your face, change pillowcases regularly, and consult with a dermatologist for personalized advice.</p>

        <h2>Schedule a Consultation</h2>
        <p>If you're struggling with acne, don't wait. Early treatment can prevent scarring and improve your skin's appearance. Book a consultation with us to develop a customized treatment plan.</p>
      `,
    },
    'benefits-laser-hair-removal': {
      title: 'The Benefits of Laser Hair Removal',
      image: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg?auto=compress&cs=tinysrgb&w=1200',
      author: 'Dr. Derma',
      date: 'March 5, 2024',
      content: `
        <h2>Why Choose Laser Hair Removal?</h2>
        <p>Laser hair removal is one of the most popular cosmetic procedures for achieving long-lasting hair reduction. It works by targeting hair follicles with concentrated light energy, preventing future growth.</p>

        <h2>Key Benefits</h2>

        <h3>Long-lasting Results</h3>
        <p>Enjoy smooth skin for months or even years. Most patients experience permanent hair reduction after completing their treatment series.</p>

        <h3>Precision</h3>
        <p>Laser technology targets dark, coarse hairs without damaging surrounding skin. The treatment is highly precise and can target specific areas with accuracy.</p>

        <h3>Speed</h3>
        <p>Each pulse takes a fraction of a second and can treat multiple hairs simultaneously. Small areas like the upper lip can be treated in minutes.</p>

        <h3>Cost-effective</h3>
        <p>While the initial investment may seem high, laser hair removal saves money on razors, waxing, and other hair removal methods over time.</p>

        <h2>What to Expect</h2>
        <p>Most patients require 3-7 sessions for optimal results, spaced 4-6 weeks apart. The procedure is quick, relatively painless (often described as a rubber band snap), and requires minimal downtime.</p>

        <h3>During Treatment</h3>
        <p>A cooling device or gel is applied to protect your skin. The laser emits a concentrated beam that targets hair follicles. You may feel slight discomfort, but most patients tolerate it well.</p>

        <h3>After Treatment</h3>
        <p>You may experience mild redness and swelling, similar to a sunburn, which typically subsides within a few hours. Avoid sun exposure and apply sunscreen to treated areas.</p>

        <h2>Is It Right for You?</h2>
        <p>Laser hair removal works best on individuals with light skin and dark hair, but advances in technology have made it suitable for a wider range of skin tones. Schedule a consultation to learn more and determine if you're a good candidate!</p>
      `,
    },
    'anti-aging-skincare-tips': {
      title: 'Anti-Aging Skincare: How to Keep Your Skin Youthful',
      image: 'https://images.pexels.com/photos/3985319/pexels-photo-3985319.jpeg?auto=compress&cs=tinysrgb&w=1200',
      author: 'Dr. Derma',
      date: 'February 28, 2024',
      content: `
        <h2>The Science of Aging Skin</h2>
        <p>As we age, our skin naturally loses collagen and elasticity, leading to wrinkles, fine lines, and sagging. However, with the right approach, you can slow down these signs of aging and maintain youthful, radiant skin.</p>

        <h2>Essential Anti-Aging Ingredients</h2>

        <h3>Retinol</h3>
        <p>Stimulates collagen production and cell turnover, reducing fine lines and improving skin texture. Start with a low concentration and gradually increase as your skin builds tolerance.</p>

        <h3>Vitamin C</h3>
        <p>A powerful antioxidant that brightens skin and protects against free radical damage. Apply in the morning under sunscreen for maximum protection.</p>

        <h3>Hyaluronic Acid</h3>
        <p>Hydrates and plumps the skin by attracting and retaining moisture. This ingredient can hold up to 1000 times its weight in water.</p>

        <h3>Peptides</h3>
        <p>Support collagen and elastin production, helping to firm and tighten skin. Peptides are building blocks that signal your skin to produce more collagen.</p>

        <h3>Niacinamide</h3>
        <p>Improves skin texture and tone while reducing the appearance of pores. This versatile ingredient also helps strengthen the skin barrier.</p>

        <h2>Professional Treatments</h2>
        <p>Our clinic offers advanced anti-aging treatments including:</p>

        <ul>
          <li><strong>Chemical Peels:</strong> Exfoliate dead skin cells and stimulate collagen production</li>
          <li><strong>Microneedling:</strong> Creates micro-injuries that trigger natural healing and collagen production</li>
          <li><strong>Laser Resurfacing:</strong> Removes damaged skin layers and promotes new collagen growth</li>
          <li><strong>Dermal Fillers:</strong> Restore lost volume and smooth deep wrinkles</li>
          <li><strong>Botox Injections:</strong> Relax muscles that cause dynamic wrinkles</li>
        </ul>

        <h2>Lifestyle Tips</h2>
        <p>Protect your skin from sun damage with daily SPF, maintain a healthy diet rich in antioxidants, stay hydrated, avoid smoking, and get adequate sleep. These lifestyle factors significantly impact how your skin ages.</p>

        <h2>Start Your Anti-Aging Journey</h2>
        <p>The best time to start an anti-aging regimen is now. Whether you're in your 20s focusing on prevention or in your 50s addressing existing concerns, we can create a customized treatment plan. Schedule a consultation today!</p>
      `,
    },
  };

  const post = slug ? blogPosts[slug] : null;

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Blog Post Not Found</h2>
          <Link to="/blog" className="text-blue-600 hover:text-blue-700">
            Return to Blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div>
      <section className="relative h-96 overflow-hidden">
        <img
          src={post.image}
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
                <span>{post.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5" />
                <span>{post.author}</span>
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

          <motion.article
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="bg-blue-50 p-8 rounded-xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Ready to Improve Your Skin?
              </h3>
              <p className="text-gray-700 mb-6">
                Schedule a consultation with our expert dermatologists to create a personalized treatment plan.
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
    </div>
  );
}

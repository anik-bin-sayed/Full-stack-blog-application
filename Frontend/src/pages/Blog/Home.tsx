import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiUser, FiTag } from "react-icons/fi";

// Sample blog post data (replace with actual data from your backend)
const featuredPosts = [
  {
    id: 1,
    title: "The Future of Web Development in 2025",
    excerpt:
      "Explore the latest trends, tools, and technologies shaping the future of web development...",
    author: "Sarah Johnson",
    date: "April 1, 2026",
    category: "Technology",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format",
    slug: "future-web-development-2025",
  },
  {
    id: 2,
    title: "Mastering Tailwind CSS: Tips & Tricks",
    excerpt:
      "Learn how to build stunning UIs faster with Tailwind CSS utility-first framework...",
    author: "Michael Chen",
    date: "March 28, 2026",
    category: "CSS",
    image:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&auto=format",
    slug: "mastering-tailwind-css",
  },
  {
    id: 3,
    title: "10 Productivity Hacks for Developers",
    excerpt:
      "Boost your coding efficiency with these practical tips and tools...",
    author: "Emily Rodriguez",
    date: "March 25, 2026",
    category: "Productivity",
    image:
      "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?w=800&auto=format",
    slug: "productivity-hacks-developers",
  },
];

const recentPosts = [
  {
    id: 4,
    title: "Getting Started with React 19",
    excerpt: "Discover the new features and improvements in React 19...",
    author: "David Kim",
    date: "March 22, 2026",
    category: "React",
    image:
      "https://images.unsplash.com/photo-1633356122102-3fe601e05bd2?w=400&auto=format",
    slug: "getting-started-react-19",
  },
  {
    id: 5,
    title: "State Management in 2026: Redux vs Zustand",
    excerpt: "Compare the most popular state management libraries...",
    author: "Lisa Wang",
    date: "March 20, 2026",
    category: "State Management",
    image:
      "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=400&auto=format",
    slug: "state-management-redux-zustand",
  },
  {
    id: 6,
    title: "Building Accessible Web Apps",
    excerpt: "A guide to making your applications usable by everyone...",
    author: "James Wilson",
    date: "March 18, 2026",
    category: "Accessibility",
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format",
    slug: "building-accessible-web-apps",
  },
];

const categories = [
  "Technology",
  "Design",
  "JavaScript",
  "React",
  "CSS",
  "Productivity",
];

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 text-white">
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fadeInUp">
              Welcome to BlogSpace
            </h1>
            <p className="text-lg md:text-xl text-indigo-100 mb-8 animate-fadeInUp animation-delay-200">
              Discover inspiring stories, expert insights, and the latest trends
              in tech, design, and development.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-400">
              <Link
                to="/blog"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
              >
                Start Reading
                <FiArrowRight className="ml-2" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white rounded-full font-semibold hover:bg-white/10 transition"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
        {/* Wave SVG at bottom */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            viewBox="0 0 1440 120"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z" />
          </svg>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
            Featured Articles
          </h2>
          <div className="w-24 h-1 bg-indigo-500 mx-auto mt-4 rounded-full" />
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Hand-picked stories to inspire and educate
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <article
              key={post.id}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3 space-x-4">
                  <span className="flex items-center">
                    <FiCalendar className="mr-1" size={14} /> {post.date}
                  </span>
                  <span className="flex items-center">
                    <FiUser className="mr-1" size={14} /> {post.author}
                  </span>
                </div>
                <Link to={`/blog/${post.slug}`}>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 hover:text-indigo-600 transition">
                    {post.title}
                  </h3>
                </Link>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="inline-flex items-center text-sm text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                    <FiTag className="mr-1" size={12} /> {post.category}
                  </span>
                  <Link
                    to={`/blog/${post.slug}`}
                    className="text-indigo-600 font-medium hover:text-indigo-800 transition flex items-center"
                  >
                    Read more <FiArrowRight className="ml-1" size={14} />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Recent Posts with Sidebar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 rounded-3xl my-8">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Main Content */}
          <div className="lg:w-2/3">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-8">
              Recent Posts
            </h2>
            <div className="space-y-6">
              {recentPosts.map((post) => (
                <article
                  key={post.id}
                  className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition flex flex-col md:flex-row"
                >
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full md:w-40 h-40 object-cover"
                  />
                  <div className="p-5 flex-1">
                    <div className="flex items-center text-sm text-gray-500 mb-2 space-x-3">
                      <span className="flex items-center">
                        <FiCalendar className="mr-1" size={12} /> {post.date}
                      </span>
                      <span className="flex items-center">
                        <FiUser className="mr-1" size={12} /> {post.author}
                      </span>
                    </div>
                    <Link to={`/blog/${post.slug}`}>
                      <h3 className="text-lg font-bold text-gray-800 hover:text-indigo-600 transition">
                        {post.title}
                      </h3>
                    </Link>
                    <p className="text-gray-600 text-sm mt-1">{post.excerpt}</p>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-block mt-2 text-indigo-600 text-sm font-medium hover:text-indigo-800"
                    >
                      Read more →
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-1/3">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/blog?category=${cat.toLowerCase()}`}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-indigo-100 hover:text-indigo-700 transition"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-3">
                Newsletter
              </h3>
              <p className="text-gray-600 text-sm mb-4">
                Get the latest posts delivered right to your inbox.
              </p>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Newsletter subscription demo");
                }}
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent mb-3"
                  required
                />
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Subscribe
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-indigo-100 text-lg mb-8">
            Join thousands of readers who explore new ideas every day.
          </p>
          <Link
            to="/blog"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Explore All Blogs
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-xl font-bold mb-4">BlogSpace</h3>
              <p className="text-sm">
                Empowering readers with quality content since 2024.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="hover:text-white transition">
                    Home
                  </Link>
                </li>
                <li>
                  <Link to="/blog" className="hover:text-white transition">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link to="/about" className="hover:text-white transition">
                    About
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-sm">
                {categories.slice(0, 4).map((cat) => (
                  <li key={cat}>
                    <Link
                      to={`/blog?category=${cat.toLowerCase()}`}
                      className="hover:text-white transition"
                    >
                      {cat}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Follow Us</h4>
              <div className="flex space-x-4">
                <a href="#" className="hover:text-white transition">
                  Twitter
                </a>
                <a href="#" className="hover:text-white transition">
                  GitHub
                </a>
                <a href="#" className="hover:text-white transition">
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-6 text-center text-sm">
            &copy; {new Date().getFullYear()} BlogSpace. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;

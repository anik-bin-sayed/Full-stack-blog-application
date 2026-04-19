import React from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";

import FeatureBlogs from "../../components/Home/FeatureBlogs";
import RecentBlogs from "../../components/Home/RecentBlogs";
import Category from "../../components/Home/Category";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-linear-to-b from-gray-50 to-white">
      <section className="relative overflow-hidden text-white">
        <div className="absolute inset-0" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-6xl text-black font-semibold mb-6 animate-fadeInUp">
              Discover Stories That Shape the Future
            </h1>
            <p
              className="text-lg md:text-xl text-black mb-8 animate-fadeInUp animation-delay-200"
              style={{ fontFamily: "Dancing Script, cursive" }}
            >
              Learn, explore, and stay ahead with expert insights in tech and
              design. CTA: Start Reading
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fadeInUp animation-delay-400">
              <Link
                to="/blogs"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-indigo-600 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
                style={{ fontFamily: "Dancing Script, cursive" }}
              >
                Start Reading
                <FiArrowRight className="ml-2" />
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0"></div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <FeatureBlogs />
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 bg-gray-50 rounded-3xl my-8">
        <div className="flex flex-col lg:flex-row gap-12">
          <RecentBlogs />
          <Category />
        </div>
      </section>

      <section className="bg-indigo-600 text-white py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to start your journey?
          </h2>
          <p className="text-indigo-100 text-lg mb-8">
            Join thousands of readers who explore new ideas every day.
          </p>
          <Link
            to="/blogs"
            className="inline-block bg-white text-indigo-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition shadow-lg"
          >
            Explore All Blogs
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;

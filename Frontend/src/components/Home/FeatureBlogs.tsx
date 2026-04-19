import React, { useEffect, useRef, useState, useCallback, memo } from "react";
import {
  FiArrowRight,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiTag,
  FiUser,
} from "react-icons/fi";
import { Link } from "react-router-dom";
import { usePublicFeatureBlogsQuery } from "../../features/blogs/blogApi";
import { formatDate } from "../../helper";

const FeatureBlogs = () => {
  const { data: featureBlogs, isLoading } = usePublicFeatureBlogsQuery();

  const carouselRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const needCarousel = featureBlogs && featureBlogs.length > 3;

  // 🚀 FAST SCROLL CHECK (no ResizeObserver)
  const checkScrollButtons = useCallback(() => {
    if (!carouselRef.current || !needCarousel) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;

    setCanScrollLeft(scrollLeft > 5);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 5);
  }, [needCarousel]);

  // throttle scroll handler
  const throttle = (fn: Function, delay: number) => {
    let last = 0;
    return (...args: any[]) => {
      const now = Date.now();
      if (now - last > delay) {
        last = now;
        fn(...args);
      }
    };
  };

  const handleScroll = throttle(checkScrollButtons, 200);

  useEffect(() => {
    const container = carouselRef.current;
    if (!container || !needCarousel) return;

    checkScrollButtons();

    container.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", checkScrollButtons);

    return () => {
      container.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkScrollButtons);
    };
  }, [needCarousel, handleScroll, checkScrollButtons]);

  const scrollLeft = () => {
    carouselRef.current?.scrollBy({
      left: -carouselRef.current.clientWidth * 0.7,
      behavior: "smooth",
    });
  };

  const scrollRight = () => {
    carouselRef.current?.scrollBy({
      left: carouselRef.current.clientWidth * 0.7,
      behavior: "smooth",
    });
  };

  const getContentPreview = (post: any) => {
    const text = (post.content || post.body || post.excerpt || "")
      .replace(/<[^>]*>/g, "")
      .split(/\s+/)
      .slice(0, 25)
      .join(" ");

    return text + (text.length > 120 ? "..." : "") || "Read more";
  };

  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      Technology: "bg-blue-50 text-blue-700",
      Design: "bg-pink-50 text-pink-700",
      JavaScript: "bg-yellow-50 text-yellow-700",
      React: "bg-cyan-50 text-cyan-700",
      CSS: "bg-green-50 text-green-700",
      Productivity: "bg-purple-50 text-purple-700",
    };
    return colors[categoryName] || "bg-gray-50 text-gray-700";
  };

  if (isLoading) {
    return (
      <div className="py-12 text-center text-gray-500">
        Loading featured blogs...
      </div>
    );
  }

  if (!featureBlogs || featureBlogs.length === 0) return null;

  const visibleBlogs = featureBlogs.slice(0, 6);

  return (
    <div className="py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900">Featured Articles</h2>
        <div className="w-14 h-0.5 bg-indigo-500 mx-auto mt-3 rounded-full" />
        <p className="text-gray-500 mt-3">
          Hand-picked stories to inspire and educate
        </p>
      </div>

      {/* Carousel Wrapper */}
      <div className="relative px-4 md:px-8">
        {/* Buttons */}
        {needCarousel && (
          <>
            <button
              onClick={scrollLeft}
              disabled={!canScrollLeft}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow border disabled:opacity-30"
            >
              <FiChevronLeft size={20} />
            </button>

            <button
              onClick={scrollRight}
              disabled={!canScrollRight}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow border disabled:opacity-30"
            >
              <FiChevronRight size={20} />
            </button>
          </>
        )}

        {/* Cards */}
        <div
          ref={carouselRef}
          className={
            needCarousel
              ? "flex overflow-x-auto gap-5 scroll-smooth pb-4"
              : "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          }
        >
          {visibleBlogs.map((post) => {
            const date = formatDate(post.created_at);
            const contentPreview = getContentPreview(post);

            return (
              <article
                key={post.id}
                className="bg-white rounded-xl border shadow-sm overflow-hidden shrink-0"
              >
                {/* Image */}
                <Link to={`/blog/details/${post.slug}`}>
                  <img
                    src={post.image}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    width={400}
                    height={250}
                    className="w-full h-48 object-cover"
                  />
                </Link>

                <div className="p-5 flex flex-col">
                  <div className="flex text-xs text-gray-500 gap-3 mb-2">
                    <span className="flex items-center gap-1">
                      <FiCalendar size={12} /> {date}
                    </span>
                    <span className="flex items-center gap-1">
                      <FiUser size={12} />
                      {post.author?.profile?.fullname ||
                        post.author?.username ||
                        "Anonymous"}
                    </span>
                  </div>

                  <Link to={`/blog/details/${post.slug}`}>
                    <h3 className="text-lg font-semibold hover:text-indigo-600 line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>

                  {/* Content */}
                  <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                    {contentPreview}
                  </p>

                  {/* Footer */}
                  <div className="flex justify-between items-center mt-4">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(
                        post.category?.name,
                      )}`}
                    >
                      <FiTag className="inline mr-1" size={12} />
                      {post.category?.name || "General"}
                    </span>

                    <Link
                      to={`/blog/details/${post.slug}`}
                      className="text-indigo-600 text-sm flex items-center gap-1"
                    >
                      Read more <FiArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default memo(FeatureBlogs);
